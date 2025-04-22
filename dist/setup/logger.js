"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const secrets_1 = require("./secrets");
const createLoggerInstance = (filename, level) => {
    return winston_1.default.createLogger({
        levels: {
            error: 0,
            info: 1,
            debug: 2,
            access: 3
        },
        format: winston_1.default.format.combine(winston_1.default.format.printf(info => {
            return `${new Date().toISOString()}: ${info.message}`;
        })),
        transports: [
            new winston_1.default.transports.Console({ level: level, }),
            new winston_daily_rotate_file_1.default({
                filename: `logs/${filename}-%DATE%.log`,
                zippedArchive: true,
                maxFiles: '30d',
                maxSize: '1g',
                level: level
            })
        ]
    });
};
const accessLogger = createLoggerInstance('access', 'access');
const debugLogger = createLoggerInstance('debug', 'debug');
const errorLogger = createLoggerInstance('error', 'error');
const access = (message) => {
    if (secrets_1.LOG_LEVEL === 'access') {
        accessLogger.log('access', message.toString());
    }
    else {
        console.error(message);
    }
};
const debug = (message) => {
    if (secrets_1.LOG_LEVEL === 'debug' || secrets_1.LOG_LEVEL === 'access') {
        debugLogger.log('debug', JSON.stringify(message.toString()));
    }
    else {
        console.log(message);
    }
};
const error = (message) => {
    if (secrets_1.LOG_LEVEL === 'error' || secrets_1.LOG_LEVEL === 'debug' || secrets_1.LOG_LEVEL === 'access') {
        errorLogger.log('error', JSON.stringify(message.toString()));
    }
    else {
        console.error(message);
    }
};
exports.default = {
    access,
    debug,
    error
};
