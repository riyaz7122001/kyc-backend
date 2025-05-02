import { getEmailTemplate } from "@models/helpers";
import { revokeEmailTokens, saveEmailToken } from "@models/helpers/auth";
import { changeCitizenActivation, createCitizen, deleteCitizen, editCitizen, getCitizenById, getCitizenDetails, getCitizenList, getDashboardDetails, getUserKyc, updateCitizenKycStatus, updateKycStatus } from "@models/helpers/citizen";
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
        const userId = req.payload!.userId;

        logger.debug(`Creating citizen with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        const user = await createCitizen(userId, email, 2, null, firstName, lastName, phone, address, transaction);
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

        logger.debug(`Updating status for userId: ${userId}`);
        await updateKycStatus(user.id!, "pending", userId, transaction);
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

export const AcceptKyc = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;
        const userId = req.payload!.userId;

        logger.debug("Fetching citizen kyc status");
        const userKycStatus = await getUserKyc(userId, transaction);
        if (userKycStatus?.status === "verified") {
            await transaction.rollback();
            sendResponse(res, 400, "Citizen kyc already verified");
        }
        logger.debug(`Citizen kyc fetched successfully`)

        logger.debug(`Changing Kyc status for userId: ${id}`);
        await updateCitizenKycStatus(id, "verified", userId, transaction);
        logger.debug(`Citizen activation status changed successfully`);

        await transaction.commit();

        sendResponse(res, 200, `Citizen Kyc verified successfully`);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const RejectKyc = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;
        const { userId, email } = req.payload!;

        logger.debug(`Changing Kyc status for userId: ${id}`);
        await updateCitizenKycStatus(id, "rejected", userId, transaction);
        logger.debug(`Citizen activation status changed successfully`);

        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>KYC Document Rejected</title>
        <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            
            <div class="flex justify-center mb-4">
            <svg fill="red" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="40px" height="40px" viewBox="0 0 41.756 41.756" 
                style="enable-background:new 0 0 41.756 41.756;" xml:space="preserve">
                <g>
                <path d="M27.948,20.878L40.291,8.536c1.953-1.953,1.953-5.119,0-7.071
                    c-1.951-1.952-5.119-1.952-7.07,0L20.878,13.809L8.535,1.465
                    c-1.951-1.952-5.119-1.952-7.07,0c-1.953,1.953-1.953,5.119,0,7.071l12.342,12.342L1.465,33.22
                    c-1.953,1.953-1.953,5.119,0,7.071C2.44,41.268,3.721,41.755,5,41.755
                    c1.278,0,2.56-0.487,3.535-1.464l12.343-12.342l12.343,12.343
                    c0.976,0.977,2.256,1.464,3.535,1.464s2.56-0.487,3.535-1.464
                    c1.953-1.953,1.953-5.119,0-7.071L27.948,20.878z"/>
                </g>
            </svg>
            </div>

            <h1 class="text-2xl font-bold text-gray-800 mb-2">KYC Document Rejected</h1>
            <p class="text-gray-600 mb-6">
            Your uploaded document did not meet the verification criteria.<br>Please upload it again.
            </p>

            <a href="/auth/login" class="inline-block">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                Upload Again
            </button>
            </a>

        </div>
        </body>
        </html>`;
        const subject = `Kyc Rejected`;

        logger.debug(`Sending email to userId: ${id}`);
        emailQueue.push({ to: email, subject, html, retry: 0 });
        logger.debug(`Email sent successfully`);

        await transaction.commit();

        sendResponse(res, 200, `Citizen Kyc rejected successfully`);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const GetDashboardDetails = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {

        logger.debug(`Fetching dashboard details`);
        const details = await getDashboardDetails();
        logger.debug(`Dashboard details fetched successfully`);

        await transaction.commit();

        sendResponse(res, 200, `Dashboard details fetched successfully`, details);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}