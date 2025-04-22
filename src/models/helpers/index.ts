import emailTemplate from "@models/emailTemplates";
import users from "@models/users"
import { Transaction } from "sequelize"

const getUserByEmail = async (email: string, isDeleted: boolean, transaction: Transaction) => {
    const user = await users.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted },
        transaction
    });
    return user;
}

const getUserById = async (id: string, isDeleted: boolean, transaction: Transaction) => {
    const user = await users.findOne({
        attributes: ['id', 'firstName', 'lastName', 'email'],
        where: { id, isDeleted }, transaction
    });
    return user;
}

const getEmailTemplate = async (title: string, transaction: Transaction) => {
    const template = await emailTemplate.findOne({
        where: { title }, transaction
    });
    return template;
}

export {
    getUserByEmail,
    getUserById,
    getEmailTemplate
}