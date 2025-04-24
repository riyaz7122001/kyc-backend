import { getUserProfile } from "@models/helpers/auth";
import logger from "@setup/logger";
import { LoginPayload, RequestWithPayload } from "@type/index";
import { sendResponse } from "@utility/api";
import { NextFunction, Response } from "express";

export const GetUserProfile = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { userId } = req.payload!;

        logger.debug(`Fetching user profile for userId: ${userId}`);
        const userProfile = await getUserProfile(userId, transaction);
        if (!userProfile) {
            await transaction.rollback();
            return sendResponse(res, 401, "User not found");
        }
        logger.debug(`User profile fetched successfully`);

        await transaction.commit();

        sendResponse(res, 200, "User profile fetched successfully", userProfile);
    } catch (error) {
        next(error);
        sendResponse(res, 500, "Something went wrong");
    }
}