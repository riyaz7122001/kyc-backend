"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.requestLogger = exports.sendResponse = void 0;
const logger_1 = __importDefault(require("@setup/logger"));
const crypto_1 = require("crypto");
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
    next();
};
exports.requestLogger = requestLogger;
const generateOtp = () => {
    return new Promise((resolve, reject) => {
        (0, crypto_1.randomInt)(100000, 999999, (err, otp) => {
            if (err)
                reject(err);
            resolve(otp.toString());
        });
    });
};
exports.generateOtp = generateOtp;
