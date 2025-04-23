import { GetUserProfile } from "@controllers/admin/auth";
import { Logout } from "@controllers/common/auth";
import { Router } from "express";

const router = Router();

router.get("/logout", Logout("admin"));
router.get(`/profile`, GetUserProfile);

export default router;