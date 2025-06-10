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

const LoginUserDTO = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(8).max(128),
})

const ForgetPasswordDTO = joi.object({
    email: joi.string().email().required()
})

const ResetPasswordDTO = joi.object({
    password: joi.string().min(8).max(64).required(),
    confirmPassword: joi.string().min(8).max(64).equal(joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must not exceed 64 characters',
        'any.required': ' Confirm password is required'
    })
})
module.exports = {
    RegisterUserDTO,
    LoginUserDTO,
    ForgetPasswordDTO,
    ResetPasswordDTO
}