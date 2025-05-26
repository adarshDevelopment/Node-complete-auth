const nodemailer = require('nodemailer');
const { smtpConfig } = require('../config/config');
class EmailService {
    #transporter;
    constructor() {
        try {
            this.#transporter = nodemailer.createTransport({
                host: smtpConfig.smtpHost,
                port: smtpConfig.smtpPort,
                secure: false,
                auth: {
                    user: smtpConfig.smtpUser,
                    pass: smtpConfig.smtpPassword
                },

            });

            // console.log('smtp host: ', smtpConfig.smtpHost, "password: ", smtpConfig.smtpPassword, ' port: ', smtpConfig.smtpPort,
            //     ' smtpUser: ', smtpConfig.smtpUser
            // );
        } catch (exception) {
            throw {
                message: 'SMTP connection error',
                status: "STMP_CONNECTION_ERR"
            }
        }
    }

    sendMail = async ({ to, subject, html, cc = null, atachments = null }) => {
        // console.log('to: ', to);
        try {
            const messageBody = {
                from: smtpConfig.smtpFrom,
                to: to,
                subject: subject,
                html: html
            }
            if (cc) {
                messageBody['cc'] = cc;
            }
            if (atachments) {
                messageBody.atachments = atachments;
            }
            const response = await this.#transporter.sendMail(messageBody);
            // console.log('response from email service: ', response);
        } catch (exception) {
            throw {
                message: 'Error sending mail',
                status: "ERROR_SENDING_EMAIL",
                details: exception.message,
            }
        }
    }
}

module.exports = new EmailService();