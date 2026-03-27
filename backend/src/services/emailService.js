const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        // Verify connection on startup
        if (process.env.NODE_ENV !== 'test') {
            this.transporter.verify((error, success) => {
                if (error) {
                    logger.error('[EmailService] Connection Error:', error);
                } else {
                    logger.info('[EmailService] SMTP Connection established successfully');
                }
            });
        }
    }

    async sendEmail({ to, subject, html, from = process.env.FROM_EMAIL }) {
        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                html,
            });
            logger.info(`[EmailService] Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            logger.error('[EmailService] Send Error:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
