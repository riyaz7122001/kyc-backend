"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidationRules = exports.ValidateReqParams = void 0;
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
