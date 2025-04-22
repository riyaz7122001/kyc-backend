"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidationRules = exports.ResetPasswordValidationRules = exports.ForgotPasswordValidationRules = exports.TokenValidationRules = exports.LoginValidationRules = exports.ActivationValidationRules = exports.IdIntValidationRules = exports.IdValidationRules = exports.ValidateReqParams = void 0;
const api_1 = require("../../utility/api");
const express_validator_1 = require("express-validator");
const ValidateReqParams = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().forEach(err => {
        if (err.type === 'field') {
            extractedErrors.push({ [err.path]: err.msg });
        }
    });
    const transaction = req.transaction;
    if (transaction) {
        await transaction.rollback();
    }
    (0, api_1.sendResponse)(res, 422, 'Invalid or missing parameters', [], extractedErrors);
};
exports.ValidateReqParams = ValidateReqParams;
const IdValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
    ];
};
exports.IdValidationRules = IdValidationRules;
const IdIntValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isInt({ min: 1 }).withMessage('Id must be of type Integer').bail(),
    ];
};
exports.IdIntValidationRules = IdIntValidationRules;
const ActivationValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
        (0, express_validator_1.body)('active')
            .not().isEmpty().withMessage('Active is required').bail()
            .isBoolean({ strict: true }).withMessage('Active must be of type Boolean').bail(),
    ];
};
exports.ActivationValidationRules = ActivationValidationRules;
const LoginValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
    ];
};
exports.LoginValidationRules = LoginValidationRules;
const TokenValidationRules = () => {
    return [
        (0, express_validator_1.body)('refreshToken')
            .not().isEmpty().withMessage('Refresh Token is required').bail()
            .isHexadecimal().withMessage('Refresh Token must be a valid hexadecimal string')
            .trim(),
    ];
};
exports.TokenValidationRules = TokenValidationRules;
const ForgotPasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
    ];
};
exports.ForgotPasswordValidationRules = ForgotPasswordValidationRules;
const ResetPasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
        (0, express_validator_1.body)('emailToken')
            .not().isEmpty().withMessage('Email Token is required').bail()
            .isHexadecimal().withMessage('Provide a valid email token')
            .trim(),
    ];
};
exports.ResetPasswordValidationRules = ResetPasswordValidationRules;
const ChangePasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
        (0, express_validator_1.body)('newPassword')
            .not().isEmpty().withMessage('New Password is required').bail()
            .isString().withMessage('New Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('New Password must be between 6 to 20 characters')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('New Password must contain atleast one lowercase, uppercase, number and special characters'),
    ];
};
exports.ChangePasswordValidationRules = ChangePasswordValidationRules;
