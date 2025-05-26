const router = require('express').Router();
const authController = require('./auth.controller');
const bodyValidator = require('../../middleares/body-validator.middleware');
const { RegisterUserDTO } = require('./auth.validator');


router.post('/register', bodyValidator(RegisterUserDTO), authController.register);
router.get('/activate-user/:token', authController.activateUser);

// login
// auth table masked Access token, maskedRefreshToken, accessToken, refreshToken,

// forgetpassword token along with expiry on the token
module.exports = router;