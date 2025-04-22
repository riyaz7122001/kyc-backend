"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = void 0;
const auth_1 = require("../../models/helpers/auth");
const api_1 = require("../../utility/api");
const GetUserProfile = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        const profile = await (0, auth_1.getUserProflie)(userId, transaction);
        if (!profile) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'Profile not found');
        }
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Profile fetched successfully', profile);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetUserProfile = GetUserProfile;
