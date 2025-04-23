"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPassword = exports.ResetPassword = exports.ForgotPassword = exports.SendOtp = exports.Login = void 0;
const helpers_1 = require("@models/helpers");
const auth_1 = require("@models/helpers/auth");
const logger_1 = __importDefault(require("@setup/logger"));
const secrets_1 = require("@setup/secrets");
const api_1 = require("@utility/api");
const auth_2 = require("@utility/auth");
const emailQueue_1 = require("@utility/emailQueue");
const Login = (userRole) => async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, userId } = req.payload;
        const { otp } = req.body;
        logger_1.default.debug(`Validating Otp for userId: ${userId}`);
        const isValidOtp = await (0, auth_1.validateOtp)(userId, otp, transaction);
        if (!isValidOtp) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid Otp");
        }
        logger_1.default.debug(`Otp validated successfully`);
        logger_1.default.debug(`Destroying the Otp`);
        await (0, auth_1.useOtp)(userId, transaction);
        logger_1.default.debug(`Otp destroyed successfully`);
        logger_1.default.debug(`Generating sessionId and jwt token`);
        const sessionId = await (0, auth_2.generateRefreshToken)(20);
        const jwt = await (0, auth_2.generateJWTToken)(userId, email, userRole, sessionId);
        logger_1.default.debug(`Session Id and Jwt token generated successfully`);
        res.cookie(`${userRole}_SESSION_TOKEN`, jwt, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: secrets_1.COOKIE_SECURE === "true" ? true : false,
            sameSite: secrets_1.COOKIE_SAME_SITE
        });
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 200, "User logged in successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.Login = Login;
const SendOtp = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, userId } = req.payload;
        const otp = await (0, api_1.generateOtp)();
        logger_1.default.debug(`Deleting Otp for userId: ${userId}`);
        await (0, auth_1.deleteOtps)(userId, transaction);
        logger_1.default.debug(`Previous Otps deleted successfully`);
        logger_1.default.debug(`Saving Otp in database for userId: ${userId}`);
        await (0, auth_1.saveOtp)(userId, otp, transaction);
        logger_1.default.debug(`Otp saved successfully`);
        logger_1.default.debug(`Getting emailTemplate for Otp`);
        const emailTemplate = await (0, helpers_1.getEmailTemplate)("otp", transaction);
        if (!emailTemplate) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 500, "Email template not found");
        }
        logger_1.default.debug(`Emailtemplate fetched successfully`);
        const html = emailTemplate.replace("{%otp%}", otp);
        const subject = "One time password";
        logger_1.default.debug(`Sending email to: ${email}`);
        emailQueue_1.emailQueue.push({ to: email, subject, html, retry: 0 });
        logger_1.default.debug(`Email sent successfully`);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Otp sent successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.SendOtp = SendOtp;
const ForgotPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ResetPassword = ResetPassword;
const SetPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.SetPassword = SetPassword;
