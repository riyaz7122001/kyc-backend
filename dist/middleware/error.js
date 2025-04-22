"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("@setup/logger"));
const api_1 = require("@utility/api");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err);
    const errStatus = (typeof err?.code === "number" ? err?.code : 500);
    const errMsg = err?.message || "Something went wrong";
    (0, api_1.sendResponse)(res, errStatus, errMsg);
};
exports.errorHandler = errorHandler;
