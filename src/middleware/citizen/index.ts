import { RequestWithPayload, WithTransaction } from "@type/index";
import { NextFunction, Response } from "express";
import { sendResponse } from "@utility/api";
import { getUserByPhone } from "@models/helpers";
import { getCitizenByEmail, getCitizenById, getRoleById, getUserKyc } from "@models/helpers/citizen";
import { ProtectedPayload } from "@type/auth";

export const ValidateCreateCitizen = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, phone } = req.body;

        const citizenByEmail = await getCitizenByEmail(email, null, transaction);
        if (citizenByEmail) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Email already exists');
        }

        const citizenByPhone = await getUserByPhone(phone, null, transaction);
        if (citizenByPhone) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Phone number already exists');
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating creation');
    }
}

export const ValidateEditCitizen = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, phone } = req.body;
        const userId = req.params.id!;

        const staffByEmail = await getCitizenByEmail(email, userId, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Email already exists');
        }

        const citizenByPhone = await getUserByPhone(phone, userId, transaction);
        if (citizenByPhone) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Phone number already exists');
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating edit');
    }
}

export const ValidateCitizenId = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params.id;

        const user = await getCitizenById(id, false, transaction);
        if (!user) {
            await transaction.rollback();
            return sendResponse(res, 404, 'Citizen not found');
        }

        req.payload = {
            userId: user.id!,
            email: user.email,
            passwordHash: user.passwordHash,
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating user id');
    }
}

export const ValidateRoleById = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const roleId = req.body.roleId;
        const role = await getRoleById(roleId, transaction);
        if (!role) {
            await transaction.rollback();
            return sendResponse(res, 404, 'Role not found');
        }
        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating role id');
    }
}

export const ValidateKyc = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { userId } = req.payload!;

        const userKycRecord = await getUserKyc(userId, transaction);
        if (!userKycRecord) {
            await transaction.rollback();
            return sendResponse(res, 400, "Kyc record not found for user");
        }

        if (userKycRecord.status === "verified") {
            await transaction.rollback();
            return sendResponse(res, 400, "User kyc is already verified");
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Something went wrong');
    }
}