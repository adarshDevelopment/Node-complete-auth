const joi = require('joi');

const requestValidator = (schema) => {
    return async (req, res, next) => {
        try {
            const data = req.body;
            if (!data) {
                throw {
                    message: "Empty payload",
                    status: "EMPTY_PAYLOAD",
                    code: 422,
                }
            }
            await schema.validateAsync(data, { abortEarly: false })
            next();

        } catch (exception) {
            // console.log('exception insdie catch: ', exception.details);
            next({
                message: 'Validation failure',
                status: 'VALIDATION_FAILURE',
                code: 422,
                details: exception.details.map(detail => detail.message)
            })

        }
    }
}

module.exports = requestValidator;