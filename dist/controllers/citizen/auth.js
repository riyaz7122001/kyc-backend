"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = void 0;
const auth_1 = require("@models/helpers/auth");
const logger_1 = __importDefault(require("@setup/logger"));
const api_1 = require("@utility/api");
const GetUserProfile = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        logger_1.default.debug(`Fetching user profile for userId: ${userId}`);
        const userProfile = await (0, auth_1.getUserProfile)(userId, transaction);
        if (!userProfile) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "User not found");
        }
        logger_1.default.debug(`User profile fetched successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "User profile fetched successfully", userProfile);
    }
    catch (error) {
        next(error);
        (0, api_1.sendResponse)(res, 500, "Something went wrong");
    }
};
exports.GetUserProfile = GetUserProfile;
