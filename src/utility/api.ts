import { NextFunction, Request, Response } from "express";
import logger from "@setup/logger";
import { ServerResponse } from "@type/index";

export const sendResponse = (res: Response, statusCode: number, message: string, data: any = [], errors: Record<string, any>[] = []) => {
    const response: ServerResponse = { success: true, message: "", data: [], errors: [] }

    if ([200, 201, 202, 203, 204].includes(statusCode)) {
        response.success = true;
    } else {
        response.success = false;
    }

    response.message = message ?? "";
    response.data = data;
    response.errors = errors;

    res.status(statusCode).json(response);
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "OPTIONS") {
        logger.debug(`Request: ${req.method} ${req.originalUrl}`);
    }
}