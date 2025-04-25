"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocs = exports.ChangeCitizenActivation = exports.DeleteCitizen = exports.GetCitizenDetails = exports.EditCitizen = exports.CreateCitizen = exports.GetCitizensList = void 0;
const helpers_1 = require("@models/helpers");
const auth_1 = require("@models/helpers/auth");
const citizen_1 = require("@models/helpers/citizen");
const logger_1 = __importDefault(require("@setup/logger"));
const secrets_1 = require("@setup/secrets");
const api_1 = require("@utility/api");
const auth_2 = require("@utility/auth");
const emailQueue_1 = require("@utility/emailQueue");
const moment_1 = __importDefault(require("moment"));
const GetCitizensList = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { size, page, search, sortKey, sortDir } = req.query;
        const offset = Number(size) * (Number(page) - 1);
        logger_1.default.debug(`Fetching citizens list`);
        const list = await (0, citizen_1.getCitizenList)(Number(size), offset, sortKey ? String(sortKey) : null, sortDir, search ? String(search) : null, transaction);
        logger_1.default.debug(`Citizen list fetched successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Citizen list fetched successfully', list);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetCitizensList = GetCitizensList;
const CreateCitizen = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { firstName, lastName, email, phone, address } = req.body;
        logger_1.default.debug(`Creating citizen with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        const user = await (0, citizen_1.createCitizen)(null, email, 2, null, firstName, lastName, phone, address, transaction);
        logger_1.default.debug(`Citizen created successfully`);
        const emailToken = await (0, auth_2.generateRefreshToken)(30);
        const content = await (0, helpers_1.getEmailTemplate)('set-password', transaction);
        if (!content) {
            throw new Error('set-password - Email template not found');
        }
        const expiry = (0, moment_1.default)().add(2, 'days').toDate().toISOString();
        const redirectUrl = `${secrets_1.FRONTEND_URL}/auth/set-password?token=${emailToken}&expiry=${expiry}`;
        const html = content.replace('{%set-password-url%}', redirectUrl);
        const subject = 'Set Password';
        logger_1.default.debug(`Revoking previous email tokens`);
        await (0, auth_1.revokeEmailTokens)(user.id, transaction);
        logger_1.default.debug(`Tokens revoked successfully`);
        logger_1.default.debug(`Saving email token`);
        await (0, auth_1.saveEmailToken)(user.id, emailToken, transaction);
        logger_1.default.debug(`Email token saved successfully`);
        logger_1.default.debug(`Updating status for userId: ${user.id}`);
        await (0, citizen_1.updateKycStatus)(user.id, "pending", user.id, transaction);
        logger_1.default.debug(`Kyc status updated successfully`);
        logger_1.default.debug(`Sending email to: ${email}`);
        emailQueue_1.emailQueue.push({ to: email, subject: subject, html: html, retry: 0 });
        logger_1.default.debug(`Email sent successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 201, 'Citizen created successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.CreateCitizen = CreateCitizen;
const EditCitizen = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, phone, address } = req.body;
        logger_1.default.debug(`Editing citizen for userId: ${userId} with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        await (0, citizen_1.editCitizen)(userId, email, firstName, lastName, phone, 2, address, transaction);
        logger_1.default.debug(`Citizen edited successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Citizen edited successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.EditCitizen = EditCitizen;
const GetCitizenDetails = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        logger_1.default.debug(`Fetching citizen details for userId: ${id}`);
        const details = await (0, citizen_1.getCitizenDetails)(id, transaction);
        if (!details) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'User not found');
        }
        logger_1.default.debug(`Citizen details fetched successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Citizen details fetched successfully', details);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetCitizenDetails = GetCitizenDetails;
const DeleteCitizen = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const userId = req.payload.userId;
        logger_1.default.debug(`Deleting citizen for userId: ${userId}`);
        await (0, citizen_1.deleteCitizen)(id, userId, transaction);
        logger_1.default.debug(`Citizen deleted successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Citizen deleted successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.DeleteCitizen = DeleteCitizen;
const ChangeCitizenActivation = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const userId = req.payload.userId;
        const { active } = req.body;
        logger_1.default.debug(`Changing citizen activation for userId: ${userId}`);
        await (0, citizen_1.changeCitizenActivation)(id, active, userId, transaction);
        logger_1.default.debug(`Citizen activation status changed successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, `Citizen ${active ? 'activated' : 'deactivated'} successfully`);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ChangeCitizenActivation = ChangeCitizenActivation;
const UploadDocs = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        const { adharNumber, panNumber } = req.body;
        const files = req.files;
        const adharBuffer = files?.adharCardPic?.[0]?.buffer;
        const panBuffer = files?.panCardPic?.[0]?.buffer;
        const adharBase64 = adharBuffer
            ? `data:${files.adharCardPic[0].mimetype};base64,${adharBuffer.toString("base64")}`
            : null;
        const panBase64 = panBuffer
            ? `data:${files.panCardPic[0].mimetype};base64,${panBuffer.toString("base64")}`
            : null;
        logger_1.default.debug(`Getting kyc record for userId: ${userId}`);
        const userKycRecord = await (0, citizen_1.getUserKyc)(userId, transaction);
        console.log("userKycRecord", userKycRecord);
        if (!userKycRecord) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "Kyc record not found for user");
        }
        logger_1.default.debug(`User kyc record fetched successfully`);
        if (userKycRecord.status === "pending" || userKycRecord.status === "rejected") {
            logger_1.default.debug(`Uploading Aadhaar/Pan card document`);
            const { created } = await (0, citizen_1.upsertKycDocsDocuments)(userKycRecord.id, adharBase64, panBase64, adharNumber, panNumber, transaction);
            if (created)
                logger_1.default.debug(`Document uploaded successfully`);
            logger_1.default.debug(`Updating status from pending to processing`);
            (0, citizen_1.updateKycStatus)(userId, "processing", userId, transaction);
            logger_1.default.debug(`Status updated successfully`);
        }
        else {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 500, "Your Kyc is already up to date");
        }
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Document uplaoded successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.UploadDocs = UploadDocs;
