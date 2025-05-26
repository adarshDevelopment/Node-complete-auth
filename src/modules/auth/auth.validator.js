const joi = require('joi');
const { Status } = require('../../config/constants.config');

const RegisterUserDTO = joi.object({
    name: joi.string().required().min(5).max(50),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(64).required(),
    confirmPassword: joi.string().min(8).max(64).equal(joi.ref('password')).required(),
    // status: joi.string().optional().allow(null, '').default(Status.Inactive),
    image: joi.string().optional().default(null).allow(null, ''),
})

module.exports = {
    RegisterUserDTO
}