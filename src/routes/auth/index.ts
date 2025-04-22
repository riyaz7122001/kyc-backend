import { ForgotPassword, Login, ResetPassword, SetPassword } from "@controllers/common/auth";
import { ValidateEmail } from "@middleware/common";
import { LoginValidationRules, ValidateReqParams } from "@middleware/common/validator";
import { Router } from "express";

const router = Router();

router.post(`/login`, LoginValidationRules(), ValidateReqParams, ValidateEmail, Login);
router.post(`/forgot-password`, ForgotPassword);
router.post(`/reset-password`, ResetPassword);
router.post(`/set-password`, SetPassword);

export default router;