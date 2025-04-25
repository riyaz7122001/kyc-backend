import { Router } from "express";
import authRouter from "./auth";
import { UploadDocs } from "@controllers/citizen/citizen";
import { ValidateReqParams } from "@middleware/common/validator";
import { UploadDocsValidator } from "@middleware/citizen/validator";
import multer from "@setup/multer";
import { ValidateKycDocs } from "@middleware/citizen";

const router = Router();

router.use(`/auth`, authRouter);
router.post("/upload", multer(2).fields([{ name: "adharCardPic", maxCount: 1 },
{ name: "panCardPic", maxCount: 1 }]), UploadDocsValidator(), ValidateReqParams, ValidateKycDocs, UploadDocs);

export default router;