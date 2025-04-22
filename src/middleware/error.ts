import logger from "@setup/logger";
import { sendResponse } from "@utility/api";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);

    const errStatus = (typeof err?.code === "number" ? err?.code : 500);
    const errMsg = err?.message || "Something went wrong";

    sendResponse(res, errStatus, errMsg);
}