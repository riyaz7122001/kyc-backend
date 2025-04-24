import moment from "moment";
import { Op } from "sequelize";
import { Transaction } from "sequelize";
import { users, roles, userOtp, userPassword, tokens } from '../index';

export const deleteOtps = async (userId: string, transaction: Transaction) => {
    await userOtp.destroy({
        where: { userId }, transaction
    })
}

export const saveOtp = async (userId: string, otp: string, transaction: Transaction) => {
    await userOtp.create({
        userId,
        otp,
        createdOn: new Date()
    }, { transaction });
}

export const getUserById = async (userId: number, deleted: boolean, activation: boolean | null, transaction: Transaction) => {
    const user = await users.findOne({
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

export const validateOtp = async (userId: string, otp: string, transaction: Transaction) => {
    const validOtp = userOtp.findOne({
        where: {
            userId,
            otp,
            createdOn: {
                [Op.gte]: moment().subtract(5, "minutes").toDate(),
            }
        }, transaction
    });

    return validOtp;
}

export const useOtp = async (otp: string, transaction: Transaction) => {
    await userOtp.destroy({
        where: { otp }, transaction
    })
}

export const getUserProfile = async (userId: string, transaction: Transaction) => {
    const user = users.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
        include: [
            {
                model: roles,
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
}

export const updatePassword = async (userId: string, passwordHash: string, transaction: Transaction) => {
    const [count] = await users.update({
        passwordHash,
        passwordSetOn: new Date()
    }, {
        where: {
            id: userId
        }, transaction
    });

    if (count === 0) throw new Error("Password cannot be updated")
}

export const updatePreviousPassword = async (userId: string, passwordHash: string, transaction: Transaction) => {
    await userPassword.create({
        userId,
        passwordHash,
        createdOn: new Date
    }, { transaction });
}

export const revokeEmailTokens = async (userId: string, transaction: Transaction) => {
    await tokens.destroy({
        where: { userId }, transaction
    });
}

export const saveEmailToken = async (userId: string, token: string, transaction: Transaction) => {
    await tokens.create({
        userId,
        token,
        createdOn: new Date()
    }, { transaction });
}

export const getUserByEmailToken = async (emailToken: string, transaction: Transaction) => {
    const user = await tokens.findOne({
        include: [{
            attributes: ['id', 'email', 'passwordHash', 'passwordSetOn', 'roleId'],
            model: users,
            foreignKey: "userId"
        }],
        where: { token: emailToken }, transaction
    });

    return user;
}