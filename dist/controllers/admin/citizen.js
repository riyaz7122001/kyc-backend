"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectKyc = exports.AcceptKyc = exports.ChangeCitizenActivation = exports.DeleteCitizen = exports.GetCitizenDetails = exports.EditCitizen = exports.CreateCitizen = exports.GetCitizensList = void 0;
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
        const userId = req.payload.userId;
        logger_1.default.debug(`Creating citizen with details: ${JSON.stringify({ firstName, lastName, email, phone, address })}`);
        const user = await (0, citizen_1.createCitizen)(userId, email, 2, null, firstName, lastName, phone, address, transaction);
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
        logger_1.default.debug(`Updating status for userId: ${userId}`);
        await (0, citizen_1.updateKycStatus)(user.id, "pending", userId, transaction);
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
const AcceptKyc = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const userId = req.payload.userId;
        logger_1.default.debug("Fetching citizen kyc status");
        const userKycStatus = await (0, citizen_1.getUserKyc)(userId, transaction);
        if (userKycStatus?.status === "verified") {
            await transaction.rollback();
            (0, api_1.sendResponse)(res, 400, "Citizen kyc already verified");
        }
        logger_1.default.debug(`Citizen kyc fetched successfully`);
        logger_1.default.debug(`Changing Kyc status for userId: ${id}`);
        await (0, citizen_1.updateCitizenKycStatus)(id, "verified", userId, transaction);
        logger_1.default.debug(`Citizen activation status changed successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, `Citizen Kyc verified successfully`);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.AcceptKyc = AcceptKyc;
const RejectKyc = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const { userId, email } = req.payload;
        logger_1.default.debug(`Changing Kyc status for userId: ${id}`);
        await (0, citizen_1.updateCitizenKycStatus)(id, "rejected", userId, transaction);
        logger_1.default.debug(`Citizen activation status changed successfully`);
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>KYC Document Rejected</title>
        <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            
            <div class="flex justify-center mb-4">
            <svg fill="red" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="40px" height="40px" viewBox="0 0 41.756 41.756" 
                style="enable-background:new 0 0 41.756 41.756;" xml:space="preserve">
                <g>
                <path d="M27.948,20.878L40.291,8.536c1.953-1.953,1.953-5.119,0-7.071
                    c-1.951-1.952-5.119-1.952-7.07,0L20.878,13.809L8.535,1.465
                    c-1.951-1.952-5.119-1.952-7.07,0c-1.953,1.953-1.953,5.119,0,7.071l12.342,12.342L1.465,33.22
                    c-1.953,1.953-1.953,5.119,0,7.071C2.44,41.268,3.721,41.755,5,41.755
                    c1.278,0,2.56-0.487,3.535-1.464l12.343-12.342l12.343,12.343
                    c0.976,0.977,2.256,1.464,3.535,1.464s2.56-0.487,3.535-1.464
                    c1.953-1.953,1.953-5.119,0-7.071L27.948,20.878z"/>
                </g>
            </svg>
            </div>

            <h1 class="text-2xl font-bold text-gray-800 mb-2">KYC Document Rejected</h1>
            <p class="text-gray-600 mb-6">
            Your uploaded document did not meet the verification criteria.<br>Please upload it again.
            </p>

            <a href="/auth/login" class="inline-block">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                Upload Again
            </button>
            </a>

        </div>
        </body>
        </html>`;
        const subject = `Kyc Rejected`;
        logger_1.default.debug(`Sending email to userId: ${id}`);
        emailQueue_1.emailQueue.push({ to: email, subject, html, retry: 0 });
        logger_1.default.debug(`Email sent successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, `Citizen Kyc rejected successfully`);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.RejectKyc = RejectKyc;
