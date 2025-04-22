import { Router } from "express";
import protectedRouter from "./protected"

const router = Router();

router.use(`/protected`, protectedRouter);

export default router;