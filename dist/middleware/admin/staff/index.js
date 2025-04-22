"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRoleById = exports.ValidateEditUser = exports.ValidateUserId = exports.ValidateCreateUser = void 0;
const staff_1 = require("../../../models/helpers/staff");
const api_1 = require("../../../utility/api");
const ValidateCreateUser = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const staffByEmail = await (0, staff_1.getUserByEmail)(email, null, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const staffByPhone = await (0, staff_1.getUserByPhone)(phone, null, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Phone number already exists');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating creation');
    }
};
exports.ValidateCreateUser = ValidateCreateUser;
const ValidateEditUser = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const userId = req.params.id;
        const staffByEmail = await (0, staff_1.getUserByEmail)(email, userId, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const staffByPhone = await (0, staff_1.getUserByPhone)(phone, userId, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Phone number already exists');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating edit');
    }
};
exports.ValidateEditUser = ValidateEditUser;
const ValidateUserId = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const user = await (0, staff_1.getUserById)(id, false, transaction);
        if (!user) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'User not found');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating user id');
    }
};
exports.ValidateUserId = ValidateUserId;
const ValidateRoleById = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const roleId = req.body.roleId;
        const role = await (0, staff_1.getRoleById)(roleId, transaction);
        if (!role) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'Role not found');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating role id');
    }
};
exports.ValidateRoleById = ValidateRoleById;
