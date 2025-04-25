"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdValidationRules = exports.PaginationValidationRules = exports.ChangePasswordValidationRules = exports.ResetPasswordValidationRules = exports.ForgotPasswordValidationRules = exports.TokenValidationRules = exports.LoginOtpValidationRules = exports.LoginValidationRules = exports.ValidateReqParams = void 0;
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
const LoginValidationRules = () => {
    console.log("inside validations");
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
const LoginOtpValidationRules = () => {
    console.log("inside validations");
    return [
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
        (0, express_validator_1.body)('otp')
            .notEmpty().withMessage('OTP is required').bail()
            .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 characters'),
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
    ];
};
exports.LoginOtpValidationRules = LoginOtpValidationRules;
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
const PaginationValidationRules = () => {
    return [
        (0, express_validator_1.query)('size')
            .not().isEmpty().withMessage('Size is required').bail()
            .isInt({ min: 1, max: 100 }).withMessage('Size must be an Integer, between 1 and 100').bail()
            .toInt(),
        (0, express_validator_1.query)('page')
            .not().isEmpty().withMessage('Page is required').bail()
            .isInt({ min: 1 }).withMessage('Page must be an Integer, greater than 0').bail()
            .toInt(),
        (0, express_validator_1.query)('search')
            .optional({ values: 'falsy' })
            .toLowerCase()
            .trim(),
        (0, express_validator_1.query)('sortKey')
            .optional({ values: 'falsy' })
            .isIn(['name', 'email', 'phone', 'role', 'active']).withMessage('SortKey should be one of name, email, phone, role, active')
            .trim(),
        (0, express_validator_1.query)('sortDir')
            .optional({ values: 'falsy' })
            .isIn(['ASC', 'DESC']).withMessage('SortDir should be one of ASC, DESC')
            .trim(),
    ];
};
exports.PaginationValidationRules = PaginationValidationRules;
const IdValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
    ];
};
exports.IdValidationRules = IdValidationRules;
