import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./citizen";

const router = Router();

router.use(`/auth`, authRouter);
router.use(`/citizen`, userRouter);

export default router;