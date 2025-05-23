import { body, check, param } from "express-validator"

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

export const UploadDocsValidator = () => {
    return [
        body("adharNumber")
            .if(body("adharNumber").exists())
            .notEmpty().withMessage("Adhar number is required when Aadhaar is used")
            .isLength({ min: 12, max: 12 }).withMessage("Adhar number must be 12 digits")
            .matches(/^\d+$/).withMessage("Adhar number must contain only digits"),

        body("adharCardPic")
            .if(body("adharNumber").exists())
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

        body("panNumber")
            .if(body("panNumber").exists())
            .notEmpty().withMessage("PAN number is required when PAN is used")
            .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/).withMessage("PAN number must be valid"),

        body("panCardPic")
            .if(body("panNumber").exists())
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

        body().custom((_, { req }) => {
            const hasAadhaar = req.body.adharNumber && req.files?.adharCardPic?.[0];
            const hasPan = req.body.panNumber && req.files?.panCardPic?.[0];

            if (!hasAadhaar && !hasPan) {
                throw new Error("Either Aadhaar details or PAN details are required");
            }

            return true;
        })
    ];
};



