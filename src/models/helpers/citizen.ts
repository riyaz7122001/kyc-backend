import { users, roles, kyc } from '../index';
import { Op, Order, Transaction } from "sequelize";

export const getCitizenList = async (limit: number, offset: number, sortKey: string | null, sortDir: 'ASC' | 'DESC' | null, search: string | null, transaction: Transaction) => {
    const searchCondition = search ? {
        [Op.or]: [
            { phone: { [Op.like]: `%${search}%` } },
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
        ]
    } : {};

    const sortColumn = sortKey && {
        'name': 'firstName',
        'phone': 'phone',
        'email': 'email',
        'active': 'activationStatus'

    }[sortKey];
    const sortOrder = sortColumn ? [[sortColumn, sortDir || 'DESC']] : [['createdOn', 'DESC']];

    const list = await users.findAndCountAll({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            isDeleted: false,
            ...searchCondition,
        },
        include: [{
            model: kyc,
            attributes: ['status', 'statusUpdatedOn', 'statusUpdatedBy'],
            foreignKey: "userId"
        }],
        limit,
        offset,
        order: sortOrder as Order,
        transaction
    });

    return list;
}

export const createCitizen = async (createdBy: string | null, email: string, roleId: number, passwordHash: string | null, firstName: string, lastName: string, phone: string, address: string | null, transaction: Transaction) => {
    const data = await users.create({
        firstName,
        lastName,
        phone,
        email,
        roleId,
        createdOn: new Date(),
        createdBy,
        isDeleted: false,
        ...(address && {
            address
        }),
        ...(passwordHash && {
            passwordHash,
            passwordSetOn: new Date()
        })
    }, { transaction });

    return data;
}

export const editCitizen = async (userId: string, email: string, firstName: string, lastName: string, phone: string, roleId: number, address: string | null, transaction: Transaction) => {
    await users.update({
        email,
        firstName,
        lastName,
        phone,
        roleId,
        ...(address && {
            address
        }),
    }, {
        where: { id: userId },
        transaction
    });
}

export const deleteCitizen = async (userId: string, deletedBy: string, transaction: Transaction) => {
    await users.update({
        isDeleted: true,
        deletedOn: new Date(),
        deletedBy
    }, {
        where: { id: userId },
        transaction
    });
}

export const getCitizenById = async (userId: string, deleted: boolean, transaction: Transaction) => {
    const data = await users.findOne({
        where: {
            id: userId,
            isDeleted: deleted
        },
        transaction
    })
    return data;
}

export const getCitizenDetails = async (userId: string, transaction: Transaction) => {
    const data = await users.findOne({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            id: userId,
            isDeleted: false
        }, transaction

    })
    return data;
}

export const changeCitizenActivation = async (userId: string, isActive: boolean, updatedBy: string, transaction: Transaction) => {
    await users.update({
        activationStatus: isActive,
        activationStatusUpdatedOn: new Date(),
        activationStatusUpdatedBy: updatedBy
    }, {
        where: { id: userId },
        transaction
    });
}

export const getRoleById = async (roleId: number, transaction: Transaction) => {
    const role = await roles.findOne({
        attributes: ['role'],
        where: { id: roleId },
        transaction
    });
    return role;
}

export const getCitizenByEmail = async (email: string, exceptionId: string | null, transaction: Transaction) => {
    const staff = await users.findOne({
        attributes: ['id'],
        where: {
            email,
            isDeleted: false,
            ...(exceptionId && { id: { [Op.ne]: exceptionId } }),
        },
        transaction
    });

    return staff;
}

export const updateKycStatus = async (userId: string, status: "pending" | "verified" | "rejected", transaction: Transaction) => {
    await kyc.create({
        userId,
        status,
        statusUpdatedOn: new Date(),
        statusUpdatedBy: userId
    }, { transaction });
}
