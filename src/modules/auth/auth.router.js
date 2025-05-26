const router = require('express').Router();
const authController = require('./auth.controller');
const bodyValidator = require('../../middleares/body-validator.middleware');
const { RegisterUserDTO } = require('./auth.validator');


router.post('/register', bodyValidator(RegisterUserDTO), authController.register);
module.exports = router;