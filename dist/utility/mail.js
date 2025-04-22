"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const secrets_1 = require("../setup/secrets");
const transporter = (0, nodemailer_1.createTransport)({
    host: secrets_1.SMTP_HOST,
    port: secrets_1.SMTP_PORT,
    secure: false,
    auth: {
        user: secrets_1.SMTP_EMAIL,
        pass: secrets_1.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendMail = async (toEmail, subject, html) => {
    const mailOptions = {
        from: secrets_1.EMAIL_FROM,
        to: toEmail,
        subject: subject,
        html: html
    };
    const info = await transporter.sendMail(mailOptions);
};
exports.default = sendMail;
