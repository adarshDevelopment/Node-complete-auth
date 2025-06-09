const express = require('express');
const app = express();
const router = require('./router.config')
require('./sql.config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Resource not found',
        status: "RESOURCE_NOT_FOUND",
    })
})

app.use((error, req, res, next) => {
    console.log('error in express: ', error);


    let message = error.message || 'Internal server error';
    let code = error.code || 500;
    let status = error.status || "INTERNAL_SERVER_ERROR";
    let details = error.details || null

    res.status(code).json({
        message: message,
        status,
        details
    })
})


module.exports = app;
