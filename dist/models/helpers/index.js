"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailTemplate = exports.getUserById = exports.getUserByEmail = void 0;
const emailTemplates_1 = __importDefault(require("@models/emailTemplates"));
const users_1 = __importDefault(require("@models/users"));
const getUserByEmail = async (email, isDeleted, transaction) => {
    const user = await users_1.default.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted },
        transaction
    });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (userId, deleted, activation, transaction) => {
    const user = await users_1.default.findOne({
        attributes: ["id", "activationStatus", "email", "passwordHash", "roleId"],
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
const getEmailTemplate = async (title, transaction) => {
    const template = await emailTemplates_1.default.findOne({
        where: { title }, transaction
    });
    return template?.content;
};
exports.getEmailTemplate = getEmailTemplate;
