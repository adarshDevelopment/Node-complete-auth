const authSvc = require('./auth.service');
const { Status } = require('../../config/constants.config');
const userSvc = require('../user/user.service');
const bcrypt = require('bcrypt');
const AuthModel = require('../auth/auth.model');
const { randomStringGenerator } = require('../../utils/helper');
const jwt = require('jsonwebtoken');
const { jwtSecret, appConfig } = require('../../config/config');

class AuthController {
    register = async (req, res, next) => {
        try {
            const data = await authSvc.transformUserCreate(req);
            const user = await authSvc.create(data);
            const response = await authSvc.sendActivationEmail(user);
            res.json({
                message: "User sucessfully created",
                status: "USER_CREATION_SUCCESS",
                data: userSvc.getPublicData(data),
                options: null,
            })

        } catch (exception) {
            next(exception);
        }
    }

    activateUser = async (req, res, next) => {
        try {
            // find the user in the db
            const token = req.params.token;
            const user = await authSvc.findSingleRowByFilter({ activationToken: token });
            // see if it is already active
            if (!user) {
                throw {
                    message: 'No user by the given token found',
                    status: "USER_NOT_FOUND",
                    code: 422
                }
            }

            if (user.status === Status.Active) {
                throw {
                    message: "User already active",
                    status: "USER_ALREADY_ACTIVE",
                    code: 409
                }
            }

            await user.update({
                status: Status.Active,
                activationToken: null
            });
            res.json({
                message: 'User successfully activated',
                status: "USER_SUCCESSFULLY_ACTIVATED",
                data: userSvc.getPublicData(user),
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }


    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // validate credentials
            const user = await authSvc.findSingleRowByFilter({ email });
            if (!user || !bcrypt.compareSync(password, user.password)) {
                throw {
                    message: 'Invalid credentials',
                    stauts: 'INVALID_CREDENTIALS',
                    code: 422
                }
            }
            // check active status
            if (user.status !== Status.Active) {
                throw {
                    message: 'User not actiave',
                    status: 'USER_NOT_ACTIVE',
                    code: 422
                }
            }
            // check auth table if user already logged in
            /*
            const auth = AuthModel.findOne({ where: { userId: user.id } });
            if (auth) {
                throw {
                    message: 'User already logged in from another device',
                    status: "USER_ALREADY_LOGGED_IN",
                    code: 422
                }
            }
            */
            // generate accessToken and refresh Token 

            const accessToken = jwt.sign({
                userId: user.id,
                type: 'Bearer'
            }, jwtSecret, {
                expiresIn: '1h'
            })

            const refreshToken = jwt.sign({
                userId: user.id,
                type: 'Refresh',
            }, jwtSecret, {
                expiresIn: '24h'
            })

            const maskedAccessToken = randomStringGenerator(150);
            const maskedRefreshToken = randomStringGenerator(150);

            const authPayload = { userId: user.id, accessToken, refreshToken, maskedAccessToken, maskedRefreshToken };
            // console.log('auth payload: ', authPayload);
            const auth = await AuthModel.create(authPayload);

            // mask tokens and send user masked access and refresh tokens
            res.json({
                message: 'User successfully logged in',
                status: 'USER_LOGGED_IN',
                data: { accessToken: maskedAccessToken, refreshToken: maskedRefreshToken },
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    logout = async (req, res, next) => {
        try {
            // fetch loggedInuser
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];

            await authSvc.logoutUser(token);

            res.json({
                message: 'User successfully logged out',
                status: 'USER_LOGGED_OUT',
                data: null,
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }

    /*
        generate code and seond email to user
        receives email
    */
    forgetPassword = async (req, res, next) => {
        try {
            // fetch the user and see if it exists
            const { email } = req.body;
            const user = await authSvc.getSinglerowByFilter({
                where: {
                    email: email
                }
            });

            if (!user) {
                throw {
                    message: "User does not exist",
                    status: "USER_DOES_NOT_EXIST",
                    code: 422
                }
            }
            user.forgetPasswordToken = randomStringGenerator(150);
            user.forgetPasswordExpiry = new Date(Date.now() + (60 * 60 * 1000));

            // send email
            await authSvc.sendForgetPasswordEmail(user, user.forgetPasswordToken);
            await user.save();
            res.json({
                message: 'Reset Password code sent',
                status: 'RESET_CODE_SENT',
                data: null,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    /*
        receive token from the user and reset password
    */
    resetPassword = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw {
                    message: 'Reset password headers not provided',
                    status: "RESET_PASSWORD_TOKEN_NOT_PROVIDED",
                    code: 422
                }
            }
            const token = authHeader.split(' ')[1];
            // const user = await userSvc.findSingleRowByFilter({ where: { forgetPasswordToken: 'token' } });
            const user = await userSvc.findSingleRowByFilter({ where: { forgetPasswordToken: token } });
            if (!user) {
                throw {
                    message: 'User not found. invalid token',
                    status: 'INVALID_TOKEN',
                    code: 422
                }
            }

            if (new Date() > user.forgetPasswordExpiry) {
                throw {
                    message: 'Token expired. Issue another token',
                    status: "TOKEN_EXPIRED",
                    code: 422
                }
            }
            const { password } = req.body;

            const hashedPassword = bcrypt.hashSync(password, 10);
            user.password = hashedPassword;
            await user.save();

            // check if token exists in the users table
            res.json({
                message: 'Password successfully reset',
                status: 'PASSWORD_RESET_SUCCESS',
                data: null,
                options: null
            })

            // check timing
            // if exists and matches, change the password and save it 
        } catch (exception) {
            next(exception);
        }
    }

    refreshToken = async (req, res, next) => {
        try {

            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw {
                    message: 'Refresh Token not provided',
                    stauts: 'TOKEN_NOT_PROVIDED',
                    code: 422
                }
            }
            const token = authHeader.split(' ')[1];
            console.log('token: ', token);

            // find corresponding refresh token
            let authObj = await authSvc.findSingleAuthRowByFilter({
                where: {
                    maskedRefreshToken: token
                }
            });

            if (!authObj) {
                throw {
                    message: 'Invalid token. Refresh token not found',
                    status: 'INVALID_TOKEN',
                    code: 422
                }
            }
            const payload = jwt.verify(authObj.refreshToken, jwtSecret);

            const user = userSvc.findByPk(payload.userId);

            if (!user) {
                throw {
                    message: 'User not found',
                    status: "USER_NOT_FOUND",
                    code: 422
                }
            }
            // generate new tokens
            const accessToken = jwt.sign({
                userId: user.id,
                type: 'Bearer'
            }, jwtSecret, {
                expiresIn: '1h'
            });

            const refreshToken = jwt.sign({
                userId: user.id,
                type: 'refresh'
            }, jwtSecret, {
                expiresIn: '24h'
            });

            const maskedAccessToken = randomStringGenerator(150);
            const maskedRefreshToken = randomStringGenerator(150);

            authObj.accessToken = accessToken;
            authObj.refreshToken = refreshToken;
            authObj.maskedAccessToken = maskedAccessToken;
            authObj.maskedRefreshToken = maskedRefreshToken;

            await authObj.save();

            res.json({
                message: 'Access token generated',
                statu: 'SUCCESS',
                data: {
                    accessToken: authObj.maskedAccessToken,
                    refreshToken: authObj.maskedRefreshToken
                },
                options: null
            });


        } catch (exception) {
            next(exception);
        }
    }
}

module.exports = new AuthController();