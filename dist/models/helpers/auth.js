"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreviousPassword = exports.updatePassword = exports.getUserProfile = exports.useOtp = exports.validateOtp = exports.getUserById = exports.saveOtp = exports.deleteOtps = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const deleteOtps = async (userId, transaction) => {
    await index_1.userOtp.destroy({
        where: { userId }, transaction
    });
};
exports.deleteOtps = deleteOtps;
const saveOtp = async (userId, otp, transaction) => {
    await index_1.userOtp.create({
        userId,
        otp,
        createdOn: new Date()
    }, { transaction });
};
exports.saveOtp = saveOtp;
const getUserById = async (userId, deleted, activation, transaction) => {
    const user = await index_1.users.findOne({
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
    const validOtp = index_1.userOtp.findOne({
        where: {
            userId,
            otp,
            createdOn: {
                [sequelize_1.Op.gte]: (0, moment_1.default)().subtract(5, "minutes").toDate(),
            }
        }, transaction
    });
    return validOtp;
};
exports.validateOtp = validateOtp;
const useOtp = async (otp, transaction) => {
    await index_1.userOtp.destroy({
        where: { otp }, transaction
    });
};
exports.useOtp = useOtp;
const getUserProfile = async (userId, transaction) => {
    const user = index_1.users.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
        include: [
            {
                model: index_1.roles,
                attributes: ['id', 'role']
            }
        ],
        where: {
            id: userId,
            isDeleted: false,
            activationStatus: true
        }, transaction
    });
    return user;
};
exports.getUserProfile = getUserProfile;
const updatePassword = async (userId, passwordHash, transaction) => {
    const [count] = await index_1.users.update({
        passwordHash,
        passwordSetOn: new Date()
    }, {
        where: {
            id: userId
        }, transaction
    });
    if (count === 0)
        throw new Error("Password cannot be updated");
};
exports.updatePassword = updatePassword;
const updatePreviousPassword = async (userId, passwordHash, transaction) => {
    await index_1.userPassword.create({
        userId,
        passwordHash,
        createdOn: new Date
    }, { transaction });
};
exports.updatePreviousPassword = updatePreviousPassword;
