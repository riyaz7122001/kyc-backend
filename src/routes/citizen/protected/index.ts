import { Router } from "express";
import authRouter from "./auth";
import { EditCitizen, UploadDocs } from "@controllers/citizen/citizen";
import { ValidateReqParams } from "@middleware/common/validator";
import { EditCitizenValidationRules, UploadDocsValidator } from "@middleware/citizen/validator";
import multer from "@setup/multer";
import { ValidateCitizenId, ValidateEditCitizen } from "@middleware/citizen";

const router = Router();

router.use(`/auth`, authRouter);
router.put("/edit/:id", EditCitizenValidationRules(), ValidateReqParams, ValidateCitizenId, ValidateEditCitizen, EditCitizen);
router.post("/upload", multer(2).fields([{ name: "adharCardPic", maxCount: 1 },
{ name: "panCardPic", maxCount: 1 }]), UploadDocsValidator(), ValidateReqParams, UploadDocs);

export default router;