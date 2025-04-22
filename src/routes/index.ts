import { Router } from "express";
import adminRouter from "./admin";
import citizenRouter from "./citizen";

const router = Router();

router.use(`/admin`, adminRouter);
router.use(`/citizen`, citizenRouter);

export default router;