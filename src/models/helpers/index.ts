import { Op } from 'sequelize';
import { users, emailTemplate } from '../index';
import { Transaction } from "sequelize"

export const getUserByEmail = async (email: string, isDeleted: boolean, transaction: Transaction) => {
    const user = await users.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted },
        transaction
    });
    return user;
}

export const getUserById = async (userId: number, deleted: boolean, activation: boolean | null, transaction: Transaction) => {
    const user = await users.findOne({
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

export const getEmailTemplate = async (title: string, transaction: Transaction) => {
    const template = await emailTemplate.findOne({
        where: { title }, transaction
    });
    return template?.content;
}

export const getUserByPhone = async (phone: string, exceptionId: string | null, transaction: Transaction) => {
    const staff = await users.findOne({
        attributes: ['id'],
        where: {
            phone,
            isDeleted: false,
            ...(exceptionId && { id: { [Op.ne]: exceptionId } }),
        },
        transaction
    });

    return staff;
}