"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserList = exports.GetUserDetails = exports.DeleteUser = exports.EditUser = exports.CreateUser = void 0;
const helpers_1 = require("../../models/helpers");
const auth_1 = require("../../models/helpers/auth");
const staff_1 = require("../../models/helpers/staff");
const secrets_1 = require("../../setup/secrets");
const api_1 = require("../../utility/api");
const auth_2 = require("../../utility/auth");
const queue_1 = require("../../utility/queue");
const moment_1 = __importDefault(require("moment"));
const CreateUser = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { firstName, lastName, email, phone, roleId, address } = req.body;
        const user = await (0, staff_1.createUser)(null, email, roleId, null, firstName, lastName, phone, address, transaction);
        const emailToken = await (0, auth_2.generateRefreshToken)(30);
        const content = await (0, helpers_1.getEmailTemplate)('set-password', transaction);
        if (!content) {
            throw new Error('set-password - Email template not found');
        }
        const expiry = (0, moment_1.default)().add(2, 'days').toDate().toISOString();
        const redirectUri = `${secrets_1.FRONTEND_URL}/set-password?token=${emailToken}&expiry=${expiry}`;
        const html = content.replace('{%set-password-url%}', redirectUri);
        const subject = 'Set Password';
        await (0, auth_1.revokePreviousEmailTokens)(user.id, 'set-password', transaction);
        await (0, auth_1.saveEmailToken)(user.id, emailToken, 'set-password', transaction);
        queue_1.emailQueue.push({ to: email, subject, html, retry: 0 });
        await transaction.commit();
        (0, api_1.sendResponse)(res, 201, 'User created successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.CreateUser = CreateUser;
const EditUser = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, phone, roleId, address } = req.body;
        await (0, staff_1.editUser)(userId, email, firstName, lastName, phone, roleId, address, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'User edited successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.EditUser = EditUser;
const DeleteUser = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const userId = req.payload.userId;
        await (0, staff_1.deleteUser)(id, userId, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'User deleted successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.DeleteUser = DeleteUser;
const ChangeUserActivation = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const userId = req.payload.userId;
        const { active } = req.body;
        await (0, staff_1.changeUserActivation)(id, active, userId, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, `User ${active ? 'activated' : 'deactivated'} successfully`);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
const GetUserDetails = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const details = await (0, staff_1.getUserDetails)(id, transaction);
        if (!details) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'User not found');
        }
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'User details fetched successfully', details);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetUserDetails = GetUserDetails;
const GetUserList = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { size, page, search, sortKey, sortDir } = req.query;
        const offset = Number(size) * (Number(page) - 1);
        const list = await (0, staff_1.getUserList)(Number(size), offset, sortKey ? String(sortKey) : null, sortDir, search ? String(search) : null, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'User list fetched successfully', list);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetUserList = GetUserList;
