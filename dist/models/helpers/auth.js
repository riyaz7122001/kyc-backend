"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProflie = exports.deleteUserSession = exports.getUserById = exports.updatePreviousPasswords = exports.updatePassword = exports.useOtp = exports.getUserDetailsFromToken = exports.useEmailToken = exports.saveEmailToken = exports.revokePreviousEmailTokens = exports.deleteOtps = exports.updateAdminSession = exports.updateUserLastLoggedIn = exports.validateOtp = exports.saveOtp = void 0;
const token_1 = __importDefault(require("@models/token"));
const tokenType_1 = __importDefault(require("@models/tokenType"));
const user_1 = __importDefault(require("@models/user"));
const userOtp_1 = __importDefault(require("@models/userOtp"));
const userPassword_1 = __importDefault(require("@models/userPassword"));
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const validateOtp = async (userId, otp, transaction) => {
    const otpData = await userOtp_1.default.findOne({
        where: {
            userId,
            otp,
            createdOn: {
                [sequelize_1.Op.gte]: (0, moment_1.default)().subtract(5, "minutes").toDate(),
            },
        },
        transaction,
    });
    return otpData;
};
exports.validateOtp = validateOtp;
const useOtp = async (userId, otp, transaction) => {
    const count = await userOtp_1.default.destroy({
        where: {
            userId,
            otp,
        },
        transaction,
    });
    if (count === 0) {
        throw new Error("Unable to use otp");
    }
};
exports.useOtp = useOtp;
const deleteOtps = async (userId, transaction) => {
    await userOtp_1.default.destroy({
        where: {
            userId,
        },
        transaction,
    });
};
exports.deleteOtps = deleteOtps;
const saveOtp = async (userId, otp, transaction) => {
    await userOtp_1.default.create({
        userId,
        otp,
        createdOn: new Date(),
    }, { transaction });
};
exports.saveOtp = saveOtp;
const updateUserLastLoggedIn = async (userId, transaction) => {
    await user_1.default.update({ lastLoggedInOn: new Date }, {
        where: {
            id: userId,
        },
        transaction,
    });
};
exports.updateUserLastLoggedIn = updateUserLastLoggedIn;
const updateAdminSession = async (userId, sessionId, transaction) => {
    await user_1.default.update({ sessionId: sessionId }, {
        where: {
            id: userId,
        },
        transaction,
    });
};
exports.updateAdminSession = updateAdminSession;
const revokePreviousEmailTokens = async (userId, type, transaction) => {
    const types = await tokenType_1.default.findOne({
        attributes: ["id"],
        where: { type: type, }
    });
    if (!types) {
        throw new Error("Token type not found");
    }
    await token_1.default.destroy({
        where: {
            userId: userId,
            typeId: types.id,
        },
        transaction,
    });
};
exports.revokePreviousEmailTokens = revokePreviousEmailTokens;
const useEmailToken = async (userId, emailToken, type, transaction) => {
    const types = await tokenType_1.default.findOne({
        attributes: ["id"],
        where: { type: type, },
        transaction,
    });
    if (!types) {
        throw new Error(`Token type not found`);
    }
    const count = await token_1.default.destroy({
        where: {
            userId: userId,
            token: emailToken,
            typeId: types.id,
        },
        transaction,
    });
    if (count === 0) {
        throw new Error(`Unable to use token`);
    }
};
exports.useEmailToken = useEmailToken;
const saveEmailToken = async (userId, emailToken, type, transaction) => {
    const types = await tokenType_1.default.findOne({
        attributes: ["id"],
        where: {
            type: type,
        },
        transaction,
    });
    if (!types) {
        throw new Error("Token type not found");
    }
    await token_1.default.create({
        userId: userId,
        token: emailToken,
        typeId: types.id,
        createdOn: new Date(),
    }, { transaction });
};
exports.saveEmailToken = saveEmailToken;
const getUserDetailsFromToken = async (emailToken, type, transaction) => {
    const types = await tokenType_1.default.findOne({
        attributes: ["id"],
        where: {
            type: type,
        },
        transaction,
    });
    const result = await token_1.default.findOne({
        attributes: ['userId'],
        where: {
            token: emailToken,
            typeId: types?.id,
            createdOn: {
                [sequelize_1.Op.gte]: type === 'set-password' ? (0, moment_1.default)().subtract(2, 'days').toDate() : (0, moment_1.default)().subtract(30, 'minutes').toDate()
            }
        },
    });
    return result;
};
exports.getUserDetailsFromToken = getUserDetailsFromToken;
const updatePassword = async (userId, passwordHash, transaction) => {
    const [count] = await user_1.default.update({
        passwordHash: passwordHash,
        passwordSetOn: new Date(),
    }, {
        where: {
            id: userId,
        },
        transaction,
    });
    if (count === 0) {
        throw new Error("Could not update password");
    }
};
exports.updatePassword = updatePassword;
const updatePreviousPasswords = async (userId, passwordHash, transaction) => {
    await userPassword_1.default.create({
        userId: userId,
        passwordHash: passwordHash,
        createdOn: new Date(),
    }, { transaction });
};
exports.updatePreviousPasswords = updatePreviousPasswords;
const getUserProflie = async (userId, transaction) => {
    const userData = await user_1.default.findOne({
        attributes: ["email", "firstName", "lastName", "phone"],
        where: {
            id: userId,
            isDeleted: false,
            activationStatus: true,
        },
        transaction,
    });
    return userData;
};
exports.getUserProflie = getUserProflie;
const getUserById = async (userId, deleted, activation, transaction) => {
    const userData = await user_1.default.findOne({
        attributes: ["id", "activationStatus", "email", "passwordHash", "sessionId", "roleId"],
        where: {
            id: userId,
            isDeleted: deleted,
            ...(activation !== null && { activationStatus: activation })
        },
        transaction,
    });
    return userData;
};
exports.getUserById = getUserById;
const deleteUserSession = async (userId, transaction) => {
    await user_1.default.update({ sessionId: null, }, {
        where: { id: userId, },
        transaction,
    });
};
exports.deleteUserSession = deleteUserSession;
