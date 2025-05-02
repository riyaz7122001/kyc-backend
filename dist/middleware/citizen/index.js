"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateKyc = exports.ValidateRoleById = exports.ValidateCitizenId = exports.ValidateEditCitizen = exports.ValidateCreateCitizen = void 0;
const api_1 = require("@utility/api");
const helpers_1 = require("@models/helpers");
const citizen_1 = require("@models/helpers/citizen");
const ValidateCreateCitizen = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const citizenByEmail = await (0, citizen_1.getCitizenByEmail)(email, null, transaction);
        if (citizenByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const citizenByPhone = await (0, helpers_1.getUserByPhone)(phone, null, transaction);
        if (citizenByPhone) {
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
exports.ValidateCreateCitizen = ValidateCreateCitizen;
const ValidateEditCitizen = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const userId = req.params.id;
        const staffByEmail = await (0, citizen_1.getCitizenByEmail)(email, userId, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const citizenByPhone = await (0, helpers_1.getUserByPhone)(phone, userId, transaction);
        if (citizenByPhone) {
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
exports.ValidateEditCitizen = ValidateEditCitizen;
const ValidateCitizenId = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const user = await (0, citizen_1.getCitizenById)(id, false, transaction);
        if (!user) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'Citizen not found');
        }
        req.payload = {
            userId: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating user id');
    }
};
exports.ValidateCitizenId = ValidateCitizenId;
const ValidateRoleById = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const roleId = req.body.roleId;
        const role = await (0, citizen_1.getRoleById)(roleId, transaction);
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
const ValidateKyc = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        const userKycRecord = await (0, citizen_1.getUserKyc)(userId, transaction);
        if (!userKycRecord) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "Kyc record not found for user");
        }
        if (userKycRecord.status === "verified") {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "User kyc is already verified");
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Something went wrong');
    }
};
exports.ValidateKyc = ValidateKyc;
