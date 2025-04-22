"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const async_1 = require("async");
const mail_1 = __importDefault(require("./mail"));
const emailQueue = (0, async_1.queue)(async (task) => {
    try {
        const { to, subject, html } = task;
        await (0, mail_1.default)(to, subject, html);
    }
    catch (error) {
        console.error(error);
        if (task.retry <= 3) {
            setTimeout(() => {
                emailQueue.push({ ...task, retry: task.retry + 1 });
            }, task.retry * 10 * 1000);
        }
        else {
            console.error('Email task failed after 3 retries');
        }
    }
}, 50);
exports.emailQueue = emailQueue;
