"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.sendResponse = void 0;
const logger_1 = __importDefault(require("@setup/logger"));
const sendResponse = (res, statusCode, message, data = [], errors = []) => {
    const response = { success: true, message: "", data: [], errors: [] };
    if ([200, 201, 202, 203, 204].includes(statusCode)) {
        response.success = true;
    }
    else {
        response.success = false;
    }
    response.message = message ?? "";
    response.data = data;
    response.errors = errors;
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
const requestLogger = (req, res, next) => {
    if (req.method !== "OPTIONS") {
        logger_1.default.debug(`Request: ${req.method} ${req.originalUrl}`);
    }
};
exports.requestLogger = requestLogger;
