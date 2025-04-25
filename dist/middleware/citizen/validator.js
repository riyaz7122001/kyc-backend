"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocsValidator = exports.EditCitizenValidationRules = exports.CreateCitizenValidationRules = void 0;
const express_validator_1 = require("express-validator");
const CreateCitizenValidationRules = () => {
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
    ];
};
exports.CreateCitizenValidationRules = CreateCitizenValidationRules;
const EditCitizenValidationRules = () => {
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
    ];
};
exports.EditCitizenValidationRules = EditCitizenValidationRules;
const UploadDocsValidator = () => {
    return [
        (0, express_validator_1.body)("adharNumber")
            .if((0, express_validator_1.body)("adharNumber").exists())
            .notEmpty().withMessage("Adhar number is required when Aadhaar is used")
            .isLength({ min: 12, max: 12 }).withMessage("Adhar number must be 12 digits")
            .matches(/^\d+$/).withMessage("Adhar number must contain only digits"),
        (0, express_validator_1.body)("adharCardPic")
            .if((0, express_validator_1.body)("adharNumber").exists())
            .custom((_, { req }) => {
            const adharFile = req.files?.adharCardPic?.[0];
            if (!adharFile) {
                throw new Error("Adhar card document is required when Aadhaar is used");
            }
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(adharFile.mimetype)) {
                throw new Error("Only JPEG, JPG, and PNG images are allowed for Aadhaar");
            }
            return true;
        }),
        (0, express_validator_1.body)("panNumber")
            .if((0, express_validator_1.body)("panNumber").exists())
            .notEmpty().withMessage("PAN number is required when PAN is used")
            .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/).withMessage("PAN number must be valid"),
        (0, express_validator_1.body)("panCardPic")
            .if((0, express_validator_1.body)("panNumber").exists())
            .custom((_, { req }) => {
            const panFile = req.files?.panCardPic?.[0];
            if (!panFile) {
                throw new Error("PAN card image is required when PAN is used");
            }
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(panFile.mimetype)) {
                throw new Error("Only JPEG, JPG, and PNG images are allowed for PAN");
            }
            return true;
        }),
        (0, express_validator_1.body)().custom((_, { req }) => {
            const hasAadhaar = req.body.adharNumber && req.files?.adharCardPic?.[0];
            const hasPan = req.body.panNumber && req.files?.panCardPic?.[0];
            if (!hasAadhaar && !hasPan) {
                throw new Error("Either Aadhaar details or PAN details are required");
            }
            return true;
        })
    ];
};
exports.UploadDocsValidator = UploadDocsValidator;
