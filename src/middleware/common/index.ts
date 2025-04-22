import { getUserByEmail } from "@models/helpers";
import sequelize from "@setup/database";
import { ProtectedPayload } from "@type/auth";
import { LoginPayload, RequestWithPayload, Role, WithTransaction } from "@type/index";
import { sendResponse } from "@utility/api";
import { decodeToken } from "@utility/auth";
import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "sequelize";

const ValidateToken = (userRole: Role) => async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    let transaction: Transaction | null = null;
    try {
        const token = req.cookies?.[`${userRole?.toUpperCase()}_SESSION`];
        if (!token) {
            return sendResponse(res, 401, "Missing session token");
        }

        let decodedToken: JwtPayload;
        try {
            decodedToken = await decodeToken(token);
        } catch (error) {
            return sendResponse(res, 403, "Invalid Token");
        }

        const claim = decodedToken?.claim;
        if (claim !== userRole) {
            return sendResponse(res, 401, "Invalid claim in token");
        }

        transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        });
    } catch (error: any) {
        await transaction?.rollback();
        return sendResponse(res, 500, error?.message?.toString() || "Internal Server Error");
    }
}

const StartTransaction = async (req: WithTransaction, res: Response, next: NextFunction) => {
    try {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

        req.transaction = transaction;

        next();
    } catch (error) {
        sendResponse(res, 500, 'Error while beginning transaction');
    }
}

const ValidateEmail = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const email = req.body.email;

        const userDetails = await getUserByEmail(email, false, transaction);
        if (!userDetails) {
            await transaction.rollback();
            return sendResponse(res, 400, "User not found");
        }

        if (!userDetails.activationStatus) {
            await transaction.rollback();
            return sendResponse(res, 400, "User is disabled");
        }

        req.payload = {
            userId: userDetails.id,
            roleId: userDetails.roleId,
            email: userDetails.email,
            passwordHash: userDetails.passwordHash
        }
        next();
    } catch (error) {
        await transaction.rollback();
        sendResponse(res, 500, "Internal server error");
    }
}

export {
    ValidateToken,
    StartTransaction,
    ValidateEmail
}