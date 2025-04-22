"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailTemplate = exports.getUserByEmail = void 0;
const emailTemplate_1 = __importDefault(require("../../models/emailTemplate"));
const user_1 = __importDefault(require("../../models/user"));
const getUserByEmail = async (email, deleted, transaction) => {
    const userData = await user_1.default.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted: deleted }, transaction
    });
    return userData;
};
exports.getUserByEmail = getUserByEmail;
const getEmailTemplate = async (title, transaction) => {
    const data = await emailTemplate_1.default.findOne({ where: { title: title }, transaction });
    return data?.content;
};
exports.getEmailTemplate = getEmailTemplate;
