import { Router } from "express";
import authRouter from "../protected/auth";
import userRouter from "../protected/user";

const router = Router();

router.use(`/auth`, authRouter);
router.use(`/user`, userRouter);

export default router;