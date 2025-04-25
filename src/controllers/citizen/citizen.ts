import { getEmailTemplate } from "@models/helpers";
import { revokeEmailTokens, saveEmailToken } from "@models/helpers/auth";
import { changeCitizenActivation, createCitizen, deleteCitizen, editCitizen, getCitizenDetails, getCitizenList, getUserKyc, updateKycStatus, upsertKycDocsDocuments } from "@models/helpers/citizen";
import logger from "@setup/logger";
import { FRONTEND_URL } from "@setup/secrets";
import { ProtectedPayload } from "@type/auth";
import { RequestWithPayload } from "@type/index";
import { sendResponse } from "@utility/api";
import { generateRefreshToken } from "@utility/auth";
import { emailQueue } from "@utility/emailQueue";
import { NextFunction, Response } from "express";
import moment from "moment";

export const GetCitizensList = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { size, page, search, sortKey, sortDir } = req.query;
        const offset = Number(size) * (Number(page) - 1);

        logger.debug(`Fetching citizens list`);
        const list = await getCitizenList(Number(size), offset, sortKey ? String(sortKey) : null, sortDir as 'ASC' | 'DESC' | null, search ? String(search) : null, transaction);
        logger.debug(`Citizen list fetched successfully`);

        await transaction.commit();

        sendResponse(res, 200, 'Citizen list fetched successfully', list);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const CreateCitizen = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { firstName, lastName, email, phone, address } = req.body;

        logger.debug(`Creating citizen with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        const user = await createCitizen(null, email, 2, null, firstName, lastName, phone, address, transaction);
        logger.debug(`Citizen created successfully`);

        const emailToken = await generateRefreshToken(30);
        const content = await getEmailTemplate('set-password', transaction)
        if (!content) {
            throw new Error('set-password - Email template not found')
        }

        const expiry = moment().add(2, 'days').toDate().toISOString();
        const redirectUrl = `${FRONTEND_URL}/auth/set-password?token=${emailToken}&expiry=${expiry}`;
        const html = content.replace('{%set-password-url%}', redirectUrl);
        const subject = 'Set Password';

        logger.debug(`Revoking previous email tokens`);
        await revokeEmailTokens(user.id!, transaction);
        logger.debug(`Tokens revoked successfully`);

        logger.debug(`Saving email token`);
        await saveEmailToken(user.id!, emailToken, transaction);
        logger.debug(`Email token saved successfully`);

        logger.debug(`Updating status for userId: ${user.id}`);
        await updateKycStatus(user.id!, "pending", user.id!, transaction);
        logger.debug(`Kyc status updated successfully`);

        logger.debug(`Sending email to: ${email}`);
        emailQueue.push({ to: email, subject: subject, html: html, retry: 0 });
        logger.debug(`Email sent successfully`);

        await transaction.commit();

        sendResponse(res, 201, 'Citizen created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}

export const EditCitizen = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, phone, address } = req.body;

        logger.debug(`Editing citizen for userId: ${userId} with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        await editCitizen(userId, email, firstName, lastName, phone, 2, address, transaction);
        logger.debug(`Citizen edited successfully`);

        await transaction.commit();

        sendResponse(res, 200, 'Citizen edited successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const GetCitizenDetails = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;

        logger.debug(`Fetching citizen details for userId: ${id}`);
        const details = await getCitizenDetails(id, transaction);
        if (!details) {
            await transaction.rollback();
            return sendResponse(res, 404, 'User not found');
        }
        logger.debug(`Citizen details fetched successfully`)

        await transaction.commit();

        sendResponse(res, 200, 'Citizen details fetched successfully', details);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const DeleteCitizen = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params.id;
        const userId = req.payload!.userId;

        logger.debug(`Deleting citizen for userId: ${userId}`);
        await deleteCitizen(id, userId, transaction);
        logger.debug(`Citizen deleted successfully`);

        await transaction.commit();

        sendResponse(res, 200, 'Citizen deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const ChangeCitizenActivation = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;
        const userId = req.payload!.userId;
        const { active } = req.body;

        logger.debug(`Changing citizen activation for userId: ${userId}`);
        await changeCitizenActivation(id, active, userId, transaction);
        logger.debug(`Citizen activation status changed successfully`);

        await transaction.commit();

        sendResponse(res, 200, `Citizen ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const UploadDocs = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { userId } = req.payload!;
        const { adharNumber, panNumber } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const adharBuffer = files?.adharCardPic?.[0]?.buffer;
        const panBuffer = files?.panCardPic?.[0]?.buffer;

        const adharBase64 = adharBuffer
            ? `data:${files.adharCardPic[0].mimetype};base64,${adharBuffer.toString("base64")}`
            : null;

        const panBase64 = panBuffer
            ? `data:${files.panCardPic[0].mimetype};base64,${panBuffer.toString("base64")}`
            : null;

        logger.debug(`Getting kyc record for userId: ${userId}`);
        const userKycRecord = await getUserKyc(userId, transaction);
        console.log("userKycRecord", userKycRecord);
        if (!userKycRecord) {
            await transaction.rollback();
            return sendResponse(res, 400, "Kyc record not found for user");
        }
        logger.debug(`User kyc record fetched successfully`);

        if (userKycRecord.status === "pending" || userKycRecord.status === "rejected") {
            logger.debug(`Uploading Aadhaar/Pan card document`);
            const { created } = await upsertKycDocsDocuments(userKycRecord.id!, adharBase64, panBase64, adharNumber, panNumber, transaction);
            if (created) logger.debug(`Document uploaded successfully`);

            logger.debug(`Updating status from pending to processing`);
            updateKycStatus(userId, "processing", userId, transaction);
            logger.debug(`Status updated successfully`)
        } else {
            await transaction.rollback();
            return sendResponse(res, 500, "Your Kyc is already up to date");
        }

        await transaction.commit();

        sendResponse(res, 200, "Document uplaoded successfully");
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}