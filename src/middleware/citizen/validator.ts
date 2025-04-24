import { body, param } from "express-validator"

export const CreateCitizenValidationRules = () => {
    return [
        body('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        body('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        body('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
    ]
}

export const EditCitizenValidationRules = () => {
    return [
        param('id')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isUUID().withMessage('Id must be of type UUID').bail(),
        body('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        body('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        body('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
    ]
}
