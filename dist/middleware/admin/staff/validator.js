"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPaginationValidationRules = exports.EditUserValidationRules = exports.CreateUserValidationRules = void 0;
const express_validator_1 = require("express-validator");
const CreateUserValidationRules = () => {
    return [
        (0, express_validator_1.body)('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        (0, express_validator_1.body)('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        (0, express_validator_1.body)('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
        (0, express_validator_1.body)('roleId')
            .not().isEmpty().withMessage('RoleId is required').bail()
            .isInt({ min: 1 }).withMessage('RoleId must be a positive integer'),
    ];
};
exports.CreateUserValidationRules = CreateUserValidationRules;
const EditUserValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isUUID().withMessage('Id must be of type UUID').bail(),
        (0, express_validator_1.body)('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        (0, express_validator_1.body)('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        (0, express_validator_1.body)('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
        (0, express_validator_1.body)('roleId')
            .not().isEmpty().withMessage('RoleId is required').bail()
            .isInt({ min: 1 }).withMessage('RoleId must be a positive integer'),
    ];
};
exports.EditUserValidationRules = EditUserValidationRules;
const UserPaginationValidationRules = () => {
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
exports.UserPaginationValidationRules = UserPaginationValidationRules;
