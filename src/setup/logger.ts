import winston from "winston";
import winstonRotate from "winston-daily-rotate-file";
import { LOG_LEVEL } from "./secrets";

const createLoggerInstance = (filename: string, level: string) => {
    return winston.createLogger({
        levels: {
            error: 0,
            info: 1,
            debug: 2,
            access: 3
        },
        format: winston.format.combine(
            winston.format.printf(info => {
                return `${new Date().toISOString()}: ${info.message}`;
            })),
        transports: [
            new winston.transports.Console({ level: level, }),
            new winstonRotate({
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

const access = (message: any) => {
    if (LOG_LEVEL === 'access') {
        accessLogger.log('access', message.toString());
    } else {
        console.error(message);
    }
}

const debug = (message: any) => {
    if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'access') {
        debugLogger.log('debug', JSON.stringify(message.toString()));
    } else {
        console.log(message);
    }
}

const error = (message: any) => {
    if (LOG_LEVEL === 'error' || LOG_LEVEL === 'debug' || LOG_LEVEL === 'access') {
        errorLogger.log('error', JSON.stringify(message.toString()));
    } else {
        console.error(message);
    }
}

export default {
    access,
    debug,
    error
}