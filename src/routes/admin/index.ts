import { Router } from "express";
import protectedRouter from "./protected";
import authRouter from "./auth"
import { StartTransaction, ValidateToken } from "@middleware/common";

const router = Router();

router.use(`/protected`, ValidateToken("admin"), protectedRouter);
router.use(`/auth`, StartTransaction, authRouter)

export default router;