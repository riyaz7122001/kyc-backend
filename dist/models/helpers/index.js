"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailTemplate = exports.getUserById = exports.getUserByEmail = void 0;
const index_1 = require("../index");
const getUserByEmail = async (email, isDeleted, transaction) => {
    const user = await index_1.users.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted },
        transaction
    });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (userId, deleted, activation, transaction) => {
    const user = await index_1.users.findOne({
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
    const template = await index_1.emailTemplate.findOne({
        where: { title }, transaction
    });
    return template?.content;
};
exports.getEmailTemplate = getEmailTemplate;
