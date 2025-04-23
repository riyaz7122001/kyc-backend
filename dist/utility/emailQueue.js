"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const logger_1 = __importDefault(require("@setup/logger"));
const async_1 = require("async");
const mail_1 = __importDefault(require("./mail"));
exports.emailQueue = (0, async_1.queue)(async (mail) => {
    try {
        const { to, subject, html } = mail;
        await (0, mail_1.default)(to, subject, html);
    }
    catch (error) {
        console.error(error);
        if (mail.retry <= 3) {
            setTimeout(() => {
                exports.emailQueue.push({ ...mail, retry: mail.retry + 1 });
            }, mail.retry * 10 * 1000);
        }
        else {
            logger_1.default.error("Email task failed after 3 tries");
        }
    }
}, 100);
