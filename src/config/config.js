require('dotenv').config();

smtpConfig = {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFrom: process.env.SMTP_FROM
}

appConfig = {
    frontendUrl: process.env.FRONTEND_URL
}


module.exports = {
    smtpConfig,
    appConfig
}