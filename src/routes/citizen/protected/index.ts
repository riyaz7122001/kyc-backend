import { Router } from "express";
import authRouter from "./auth";
import { UploadDocs } from "@controllers/citizen/citizen";

const router = Router();

router.use(`/auth`, authRouter);
router.use("/upload", UploadDocs);

export default router;