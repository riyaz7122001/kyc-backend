import { getEmailTemplate } from "@models/helpers";
import { deleteOtps, saveOtp, useOtp, validateOtp } from "@models/helpers/auth";
import logger from "@setup/logger";
import { COOKIE_SAME_SITE, COOKIE_SECURE, FRONTEND_URL } from "@setup/secrets";
import { ProtectedPayload } from "@type/auth";
import { LoginPayload, RequestWithPayload, Role } from "@type/index";
import { generateOtp, sendResponse } from "@utility/api"
import { generateJWTToken, generateRefreshToken } from "@utility/auth";
import { emailQueue } from "@utility/emailQueue";
import { NextFunction, Response } from "express"
import moment from "moment";

export const Login = (userRole: Role) => async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, userId } = req.payload!;
        const { otp } = req.body;

        logger.debug(`Validating Otp for userId: ${userId}`);
        const isValidOtp = await validateOtp(userId, otp, transaction);
        if (!isValidOtp) {
            await transaction.rollback();
            return sendResponse(res, 401, "Invalid Otp");
        }
        logger.debug(`Otp validated successfully`);

        logger.debug(`Destroying the Otp`);
        await useOtp(userId, transaction);
        logger.debug(`Otp destroyed successfully`);

        logger.debug(`Generating sessionId and jwt token`);
        const sessionId = await generateRefreshToken(20);
        const jwt = await generateJWTToken(userId, email, userRole, sessionId);
        logger.debug(`Session Id and Jwt token generated successfully`);

        res.cookie(`${userRole.toUpperCase()}_SESSION_TOKEN`, jwt, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: COOKIE_SECURE === "true" ? true : false,
            sameSite: COOKIE_SAME_SITE as "lax" | "strict" | "none"
        });

        await transaction.rollback();

        sendResponse(res, 200, "User logged in successfully");
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const SendOtp = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, userId } = req.payload!;
        const otp = await generateOtp();

        logger.debug(`Deleting Otp for userId: ${userId}`);
        await deleteOtps(userId, transaction);
        logger.debug(`Previous Otps deleted successfully`);

        logger.debug(`Saving Otp in database for userId: ${userId}`);
        await saveOtp(userId, otp, transaction);
        logger.debug(`Otp saved successfully`);

        logger.debug(`Getting emailTemplate for Otp`)
        const emailTemplate = await getEmailTemplate("otp", transaction);
        if (!emailTemplate) {
            await transaction.rollback();
            return sendResponse(res, 500, "Email template not found");
        }
        logger.debug(`Emailtemplate fetched successfully`);

        const html = emailTemplate.replace("{%otp%}", otp);
        const subject = "One time password";

        logger.debug(`Sending email to: ${email}`);
        emailQueue.push({ to: email, subject, html, retry: 0 });
        logger.debug(`Email sent successfully`);

        await transaction.commit();

        sendResponse(res, 200, "Otp sent successfully");
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const ForgotPassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email } = req.body;

        logger.debug(`Fetching template for forgot password`);
        const emailTemplate = await getEmailTemplate("forgot-password", transaction);
        if (!emailTemplate) {
            await transaction.rollback();
            return sendResponse(res, 404, "Email template not found");
        }
        logger.debug(`Email template fetched successfully`);

        const emailToken = await generateRefreshToken(30);
        const expiry = moment().add(10, "minutes").toDate().toISOString();
        const redirectUrl = `${FRONTEND_URL}/auth/reset-password?token=${emailToken}&expiry=${expiry}`;
        const html = emailTemplate.replace("{%reset-password-url%}", redirectUrl);

        const subject = "Forgot Password";

        logger.debug(`Sending email to: ${email}`);
        emailQueue.push({ to: email, subject: subject, html: html, retry: 0 });
        logger.debug(`Email sent successfully`);

        await transaction.commit();

        sendResponse(res, 200, "Email sent successfully");
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const ResetPassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const SetPassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const Logout = (userRole: Role) => async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!
    try {
        res.clearCookie(`${userRole.toUpperCase()}_SESSION_TOKEN`, {
            sameSite: COOKIE_SAME_SITE as "lax" | "strict" | "none",
            httpOnly: true,
            secure: COOKIE_SECURE === "true" ? true : false
        });

        await transaction.commit();

        sendResponse(res, 200, "User logged out successfully");
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}