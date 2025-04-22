"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleById = exports.changeUserActivation = exports.getUserList = exports.getUserDetails = exports.getUserById = exports.deleteUser = exports.editUser = exports.createUser = exports.getUserByPhone = exports.getUserByEmail = void 0;
const role_1 = __importDefault(require("@models/role"));
const user_1 = __importDefault(require("../../models/user"));
const sequelize_1 = require("sequelize");
const getUserByEmail = async (email, exceptionId, transaction) => {
    const staff = await user_1.default.findOne({
        attributes: ['id'],
        where: {
            email,
            isDeleted: false,
            ...(exceptionId && { id: { [sequelize_1.Op.ne]: exceptionId } }),
        },
        transaction
    });
    return staff;
};
exports.getUserByEmail = getUserByEmail;
const getUserByPhone = async (phone, exceptionId, transaction) => {
    const staff = await user_1.default.findOne({
        attributes: ['id'],
        where: {
            phone,
            isDeleted: false,
            ...(exceptionId && { id: { [sequelize_1.Op.ne]: exceptionId } }),
        },
        transaction
    });
    return staff;
};
exports.getUserByPhone = getUserByPhone;
const createUser = async (createdBy, email, roleId, passwordHash, firstName, lastName, phone, address, transaction) => {
    const data = await user_1.default.create({
        firstName,
        lastName,
        phone,
        email,
        roleId,
        createdOn: new Date(),
        createdBy,
        ...(address && {
            address
        }),
        ...(passwordHash && {
            passwordHash,
            passwordSetOn: new Date()
        })
    }, { transaction });
    return data;
};
exports.createUser = createUser;
const editUser = async (userId, email, firstName, lastName, phone, roleId, address, transaction) => {
    await user_1.default.update({
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
};
exports.editUser = editUser;
const deleteUser = async (userId, deletedBy, transaction) => {
    await user_1.default.update({
        isDeleted: true,
        deletedOn: new Date(),
        deletedBy
    }, {
        where: { id: userId },
        transaction
    });
};
exports.deleteUser = deleteUser;
const getUserById = async (userId, deleted, transaction) => {
    const data = await user_1.default.findOne({
        where: {
            id: userId,
            isDeleted: deleted
        },
        transaction
    });
    return data;
};
exports.getUserById = getUserById;
const getUserDetails = async (userId, transaction) => {
    const data = await user_1.default.findOne({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            id: userId,
            isDeleted: false
        },
    });
    return data;
};
exports.getUserDetails = getUserDetails;
const getUserList = async (limit, offset, sortKey, sortDir, search, transaction) => {
    const searchCondition = search ? {
        [sequelize_1.Op.or]: [
            { phone: { [sequelize_1.Op.like]: `%${search}%` } },
            { firstName: { [sequelize_1.Op.iLike]: `%${search}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${search}%` } },
            { email: { [sequelize_1.Op.iLike]: `%${search}%` } }
        ]
    } : {};
    const sortColumn = sortKey && {
        'name': 'firstName',
        'phone': 'phone',
        'email': 'email',
        'active': 'activationStatus'
    }[sortKey];
    const sortOrder = sortColumn ? [[sortColumn, sortDir || 'DESC']] : [['createdOn', 'DESC']];
    const list = await user_1.default.findAndCountAll({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            isDeleted: false,
            ...searchCondition,
        },
        limit,
        offset,
        order: sortOrder,
        transaction
    });
    return list;
};
exports.getUserList = getUserList;
const changeUserActivation = async (userId, isActive, updatedBy, transaction) => {
    await user_1.default.update({
        activationStatus: isActive,
        activationStatusUpdatedOn: new Date(),
        activationStatusUpdatedBy: updatedBy
    }, {
        where: { id: userId },
        transaction
    });
};
exports.changeUserActivation = changeUserActivation;
const getRoleById = async (roleId, transaction) => {
    const role = await role_1.default.findOne({
        attributes: ['role'],
        where: { id: roleId },
        transaction
    });
    return role;
};
exports.getRoleById = getRoleById;
