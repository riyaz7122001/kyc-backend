import { ForgotPassword, Login, ResetPassword, SendOtp, SetPassword } from "@controllers/common/auth";
import { ValidateEmail, ValidateEmailToken, ValidatePassword } from "@middleware/common";
import { ForgotPasswordValidationRules, LoginOtpValidationRules, LoginValidationRules, ResetPasswordValidationRules, ValidateReqParams } from "@middleware/common/validator";
import { Router } from "express";

const router = Router();

router.post(`/login`, LoginOtpValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, Login("admin"));
router.post(`/otp`, LoginValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, SendOtp);
router.post(`/forgot-password`, ForgotPasswordValidationRules(), ValidateReqParams, ValidateEmail, ForgotPassword);
router.post(`/reset-password`, ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken, ResetPassword);
router.post(`/set-password`, ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken, SetPassword);

export default router;