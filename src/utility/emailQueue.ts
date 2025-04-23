import logger from "@setup/logger";
import { queue } from "async";
import sendMail from "./mail";

export const emailQueue = queue(async (mail: { to: string, subject: string, html: string, retry: number }) => {
    try {
        const { to, subject, html } = mail;
        await sendMail(to, subject, html);
    } catch (error) {
        console.error(error);

        if (mail.retry <= 3) {
            setTimeout(() => {
                emailQueue.push({ ...mail, retry: mail.retry + 1 });
            }, mail.retry * 10 * 1000);
        } else {
            logger.error("Email task failed after 3 tries");
        }
    }
}, 100)