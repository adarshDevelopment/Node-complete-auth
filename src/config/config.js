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

sqlConfig = {
    dialect: process.env.SQL_DIALECT,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    db: process.env.SQL_DB,
    port: process.env.SQL_PORT
}

module.exports = {
    smtpConfig,
    appConfig,
    sqlConfig
}