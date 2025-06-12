const router = require('express').Router();
const authController = require('./auth.controller');
const bodyValidator = require('../../middlewares/body-validator.middleware');
const { RegisterUserDTO, LoginUserDTO, ForgetPasswordDTO, ResetPasswordDTO } = require('./auth.validator');
const auth = require('../../middlewares/auth.middleware');




router.post('/register', bodyValidator(RegisterUserDTO), authController.register);
router.get('/activate-user/:token', authController.activateUser);
router.post('/login', bodyValidator(LoginUserDTO), authController.login);
router.post('/logout', auth(), authController.logout);

router.post('/forget-password', bodyValidator(ForgetPasswordDTO), authController.forgetPassword);

router.put('/reset-password', bodyValidator(ResetPasswordDTO), authController.resetPassword)

router.post('/refresh-token', authController.refreshToken);
// login
// auth table masked Access token, maskedRefreshToken, accessToken, refreshToken,

// forgetpassword token along with expiry on the token
module.exports = router;