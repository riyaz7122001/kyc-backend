import { getUserByEmail, getUserById } from "@models/helpers";
import { getUserByEmailToken } from "@models/helpers/auth";
import sequelize from "@setup/database";
import { ProtectedPayload } from "@type/auth";
import { LoginPayload, RequestWithPayload, Role, WithTransaction } from "@type/index";
import { sendResponse } from "@utility/api";
import { decodeToken, validatePassword } from "@utility/auth";
import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "sequelize";

export const ValidateToken = (userRole: Role) => async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    let transaction: Transaction | null = null;
    try {
        const token = req.cookies?.[`${userRole?.toUpperCase()}_SESSION_TOKEN`];
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

        const user = await getUserById(decodedToken.id!, false, true, transaction);
        if (!user || (user?.roleId !== 1 && userRole === "admin") || (user?.roleId !== 2 && userRole === "citizen")) {
            await transaction.rollback();
            return sendResponse(res, 403, "Invalid user");
        }

        if (!user.activationStatus) {
            await transaction.rollback();
            return sendResponse(res, 403, "Your account has been disabled, please contact system administrator");
        }

        req.transaction = transaction;
        req.payload = {
            userId: user.id!,
            email: user.email,
            passwordHash: user.passwordHash
        }

        next();
    } catch (error: any) {
        await transaction?.rollback();
        return sendResponse(res, 500, error?.message?.toString() || "Internal Server Error");
    }
}

export const StartTransaction = async (req: WithTransaction, res: Response, next: NextFunction) => {
    try {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

        req.transaction = transaction;

        next();
    } catch (error) {
        sendResponse(res, 500, 'Error while beginning transaction');
    }
}

export const ValidateEmail = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
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
            userId: userDetails.id!,
            roleId: userDetails.roleId,
            email: userDetails.email,
            passwordHash: userDetails.passwordHash,
            passwordSetOn: userDetails.passwordSetOn
        }
        next();
    } catch (error) {
        await transaction.rollback();
        sendResponse(res, 500, "Internal server error");
    }
}

export const ValidatePassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { password } = req.body;
        const { passwordHash, passwordSetOn } = req.payload!;

        if (!passwordHash || !passwordSetOn) {
            await transaction.rollback();
            return sendResponse(res, 403, "Password not set for user");
        }

        const isValidPassword = await validatePassword(password, passwordHash);
        if (!isValidPassword) {
            await transaction.rollback();
            return sendResponse(res, 401, "Invalid password");
        }

        req.payload = {
            ...req.payload!
        }

        next();
    } catch (error) {
        await transaction.rollback();
        sendResponse(res, 500, "Internal server error");
    }
}

export const ValidateEmailToken = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    console.log("insdie validate email token")
    const transaction = req.transaction!
    try {
        const { emailToken } = req.body;

        const userDetails = await getUserByEmailToken(emailToken, transaction);
        if (!userDetails) {
            await transaction.rollback();
            return sendResponse(res, 401, "Invalid token");
        }

        req.payload = {
            userId: userDetails.userId,
            email: userDetails.user?.email!,
            passwordHash: userDetails?.user?.passwordHash,
            passwordSetOn: userDetails.user?.passwordSetOn,
            roleId: userDetails?.user?.roleId!
        }
        next();
    } catch (error) {
        await transaction.rollback();
        sendResponse(res, 500, "Internal server error");
    }
}

export const ValidateChangePassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { password } = req.body;
        const { passwordHash } = req.payload!;

        if (!passwordHash) {
            await transaction.rollback();
            return sendResponse(res, 400, "Password not set");
        }

        const isValidPassword = await validatePassword(password, passwordHash);
        if (!isValidPassword) {
            await transaction.rollback();
            return sendResponse(res, 400, "Invalid Password");
        }

        next();
    } catch (error) {
        await transaction.rollback();
        sendResponse(res, 500, "Internal server error");
    }
}