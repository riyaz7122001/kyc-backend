"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const citizen_1 = require("@controllers/citizen/citizen");
const validator_1 = require("@middleware/common/validator");
const validator_2 = require("@middleware/citizen/validator");
const multer_1 = __importDefault(require("@setup/multer"));
const citizen_2 = require("@middleware/citizen");
const router = (0, express_1.Router)();
router.use(`/auth`, auth_1.default);
router.put("/edit/:id", (0, validator_2.EditCitizenValidationRules)(), validator_1.ValidateReqParams, citizen_2.ValidateCitizenId, citizen_2.ValidateEditCitizen, citizen_1.EditCitizen);
router.post("/upload", (0, multer_1.default)(2).fields([{ name: "adharCardPic", maxCount: 1 },
    { name: "panCardPic", maxCount: 1 }]), (0, validator_2.UploadDocsValidator)(), validator_1.ValidateReqParams, citizen_1.UploadDocs);
exports.default = router;
