import { CreateCitizen } from "@controllers/citizen/citizen";
import { ForgotPassword, Login, ResetPassword, SendOtp, SetPassword } from "@controllers/common/auth";
import { ValidateCreateCitizen } from "@middleware/citizen";
import { CreateCitizenValidationRules } from "@middleware/citizen/validator";
import { ValidateEmail, ValidateEmailToken, ValidatePassword } from "@middleware/common";
import { ForgotPasswordValidationRules, LoginOtpValidationRules, LoginValidationRules, ResetPasswordValidationRules, ValidateReqParams } from "@middleware/common/validator";
import { Router } from "express";

const router = Router();

router.post("/register", CreateCitizenValidationRules(), ValidateReqParams, ValidateCreateCitizen, CreateCitizen);
router.post("/login", LoginOtpValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, Login("citizen"));
router.post("/otp", LoginValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, SendOtp);
router.post("/forgot-password", ForgotPasswordValidationRules(), ValidateReqParams, ValidateEmail, ForgotPassword);
router.post("/reset-password", ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken, ResetPassword);
router.post("/set-password", ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken, SetPassword);

export default router;