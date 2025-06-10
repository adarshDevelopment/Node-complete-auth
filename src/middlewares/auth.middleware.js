const jwt = require('jsonwebtoken');
const AuthModel = require('../modules/auth/auth.model');
const { jwtSecret } = require('../config/config');
const UserModel = require('../modules/user/user.model');
const { Status } = require('../config/constants.config');

const auth = (roles) => {
    return async (req, res, next) => {

        try {
            // extract access token
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw {
                    message: 'No token provided',
                    status: 'NO_TOKEN_PROVIDED',
                    code: 422
                }
            }
            // split bearer 
            const token = authHeader.split(' ')[1];
            // fetch from auths table
            const auth = await AuthModel.findOne({
                where: {
                    maskedAccessToken: token
                }
            });
            if (!auth) {
                throw {
                    message: 'Access Token not found',
                    status: 'TOKEN_NOT_FOUND',
                    code: 422
                }
            }
            // verify accessToken
            const accessToken = auth.accessToken;
            const tokenPayload = jwt.verify(accessToken, jwtSecret);

            if (tokenPayload.type !== 'Bearer') {
                next({
                    message: 'Invalid Token type',
                    status: 'INVALID_TOKEN',
                    code: 422
                })
            }

            // find corresponding user 
            const user = await UserModel.findByPk(tokenPayload.userId);
            // see if the user is active
            if (!user) {
                throw {
                    message: 'User not found',
                    status: 'USER_NOT_FOUND',
                    code: 422
                }
            }

            if (user.status !== Status.Active) {
                throw {
                    message: 'User not active',
                    status: "USER_NOT_ACTIVE",
                    code: 422
                }
            }

            // see if the argument role matches the user role
            // attach loggedInUser to req
            if (roles) {
                if (!(user.roles === roles || user.roles === 'admin' || (Array.isArray(roles) && roles.includes(user.roles)))) {
                    throw {
                        message: "Unauthorized User",
                        status: 'UNAUTHORIZED',
                        code: 422
                    };
                }
            }

            req.loggedInUser = user;
            next();

        } catch (exception) {
            next(exception);
        }

    }
}

module.exports = auth;