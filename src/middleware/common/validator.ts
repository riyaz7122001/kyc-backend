import { WithTransaction } from "@type/index";
import { sendResponse } from "../../utility/api";
import { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";

const ValidateReqParams = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: Record<string, any>[] = []
    errors.array().forEach(err => {
        if (err.type === 'field') {
            extractedErrors.push({ [err.path]: err.msg })
        }
    })

    const transaction = req.transaction;
    if (transaction) {
        await transaction.rollback();
    }

    sendResponse(res, 422, 'Invalid or missing parameters', [], extractedErrors);
}

const LoginValidationRules = () => {
    return [
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
        body('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
    ]
}

export {
    ValidateReqParams,
    LoginValidationRules
}