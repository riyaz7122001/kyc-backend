"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOtp = exports.validateOtp = exports.getUserById = exports.saveOtp = exports.deleteOtps = void 0;
const userOtp_1 = __importDefault(require("@models/userOtp"));
const users_1 = __importDefault(require("@models/users"));
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const deleteOtps = async (userId, transaction) => {
    await userOtp_1.default.destroy({
        where: { userId }, transaction
    });
};
exports.deleteOtps = deleteOtps;
const saveOtp = async (userId, otp, transaction) => {
    await userOtp_1.default.create({
        userId,
        otp,
        createdOn: new Date()
    }, { transaction });
};
exports.saveOtp = saveOtp;
const getUserById = async (userId, deleted, activation, transaction) => {
    const user = await users_1.default.findOne({
        attributes: ["id", "activationStatus", "email", "passwordHash", "sessionId", "roleId"],
        where: {
            id: userId,
            isDeleted: deleted,
            ...(activation !== null && { activationStatus: activation })
        },
        transaction,
    });
    return user;
};
exports.getUserById = getUserById;
const validateOtp = async (userId, otp, transaction) => {
    const validOtp = userOtp_1.default.findOne({
        where: {
            userId,
            otp,
            createdOn: {
                [sequelize_1.Op.gte]: (0, moment_1.default)().subtract(5, "minutes").toDate(),
            }
        }, transaction
    });
    return !!validOtp;
};
exports.validateOtp = validateOtp;
const useOtp = async (otp, transaction) => {
    await userOtp_1.default.destroy({
        where: { otp }, transaction
    });
};
exports.useOtp = useOtp;
