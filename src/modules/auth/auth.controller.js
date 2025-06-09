const authSvc = require('./auth.service');
const { Status } = require('../../config/constants.config');
const userSvc = require('../user/user.service');


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
                    mesage: "User already active",
                    status: "USER_ALREADY_ACTIVE",
                    code: 409
                }
            }
            await user.update({
                statu: Status.Active,
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

        login = async (req, res, next) => {
            try {
                // validate credentials

                // check auth table if user already logged in

                // generate accessToken and refresh Token 

                // mask tokens and send user masked access and refresh tokens
            } catch (exception) {
                next(exception);
            }
        }

        logout = async (req, res, next) => {
            try {

            } catch (excetpion) {

            }
        }

        forgetPassword = async (req, res, next) => {
            try {

            } catch (excetpion) {

            }
        }


    }
}

module.exports = new AuthController();