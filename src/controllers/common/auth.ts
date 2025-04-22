import { sendResponse } from "@utility/api"
import { NextFunction, Request, Response } from "express"

const Login = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        sendResponse(res, 400, "Something went wrong");
    }
}

const ForgotPassword = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        sendResponse(res, 400, "Something went wrong");
    }
}

const ResetPassword = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        sendResponse(res, 400, "Something went wrong");
    }
}

const SetPassword = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        sendResponse(res, 400, "Something went wrong");
    }
}

export {
    Login,
    ForgotPassword,
    ResetPassword,
    SetPassword
}