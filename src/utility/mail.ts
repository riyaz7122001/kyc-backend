import { createTransport } from 'nodemailer';
import { EMAIL_FROM, SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from '../setup/secrets';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
} as SMTPTransport.Options);

const sendMail = async (toEmail: string, subject: string, html: string) => {
    const mailOptions = {
        from: EMAIL_FROM,
        to: toEmail,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
}

export default sendMail;