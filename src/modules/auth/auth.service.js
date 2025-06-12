const { Status } = require('../../config/constants.config')
// const models = require('../../../models/index');
const BaseService = require('../../services/base.service');
const emailSvc = require('../../services/email.service');
const { smtpConfig, appConfig } = require('../../config/config')
const { randomStringGenerator } = require('../../utils/helper');
const UserModel = require('../user/user.model');
const bcrypt = require('bcrypt');
const AuthModel = require('./auth.model');

class AuthService extends BaseService {
    constructor(model) {
        super(model);
    }

    transformUserCreate = async (req) => {
        try {
            const data = req.body;

            data.status = Status.Inactive;

            // check if email already exists
            const user = await UserModel.findOne({ where: { email: data.email } });

            if (user) {
                throw {
                    message: "User with the same email already exists",
                    stauts: "DUPLICATE_EMAIL_ADDRESS",
                    code: 409
                }
            }
            // delete confirmPassword
            delete data.confirmPassword;

            // hash password
            data.password = bcrypt.hashSync(data.password, 10);

            // set random string token
            data.activationToken = randomStringGenerator(150);

            return data;
        } catch (exception) {
            throw exception;
        }
    }

    sendActivationEmail = async (user) => {
        try {
            await emailSvc.sendMail({
                to: user.email,
                subject: 'Account activation',
                html: `
                    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                            <tr>
                                <td style="padding: 30px; text-align: center;">
                                    <h2 style="color: #222;">Activate Your Account</h2>
                                    <p style="font-size: 16px; line-height: 1.6;">
                                        Please activate your account by clicking the button below.
                                    </p>
                                    <a href="${appConfig.frontendUrl}activate-user/${user.activationToken}" 
                                        style="display: inline-block; margin-top: 20px; padding: 12px 25px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                                        Activate Account
                                    </a>
                                    <p style="margin-top: 30px; font-size: 14px; color: #555;">
                                        If the button doesn't work, copy and paste the following link into your browser:
                                    </p>
                                    <p style="word-break: break-all; font-size: 14px; color: #007BFF;">
                                        <a href="${appConfig.frontendUrl}activate-user/${user.activationToken}" style="color: #007BFF; text-decoration: underline;">
                                            ${appConfig.frontendUrl}activate-user/${user.activationToken}
                                        </a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </body>
                `
            })
        } catch (exception) {
            throw exception;
        }
    }

    logoutUser = async (token) => {
        try {
            // fetch data from auth table
            const auth = await AuthModel.findOne({
                maskedAccessToken: token
            });
            if (!auth) {
                throw {
                    message: 'User already logged out',
                    status: 'USER_ALREADY_LOGGED_OUT',
                    status: 422
                }
            }

            // see if it exists
            const user = await this.model.findByPk(auth.userId);
            if (!user) {
                throw {
                    message: 'User not found',
                    status: 'USER_NOT_FOUND',
                    status: 422
                }
            }

            return await auth.destroy();

            // 
        } catch (exception) {
            throw exception;
        }
    }

    getSinglerowByFilter = async (filter) => {
        try {
            return await this.model.findOne(filter);

        } catch (exception) {
            throw exception;
        }
    }

    sendForgetPasswordEmail = async (user, token) => {
        try {
            await emailSvc.sendMail({
                to: user.email,
                subject: "Password Reset Link",
                html: `
                     <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
                        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #ddd;">
                        <h2 style="color: #2c3e50;">Password Reset Request</h2>
                        <p style="font-size: 16px;">
                            You requested to reset your password. Click the button below to proceed:
                        </p>

                        <button style="display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; border: none; cursor: pointer;"
                            onclick="window.location.href='${appConfig.frontendUrl}forgetPassword?token=${token}'">
                            Reset Password
                        </button>

                        <p style="font-size: 14px; color: #555;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="word-break: break-all; font-size: 14px; color: #007bff;">
                            ${appConfig.frontendUrl}forgetPassword?token=${token}
                        </p>

                        <p style="font-size: 14px; color: #888;">
                            If you did not request a password reset, you can safely ignore this email.
                        </p>
                        </div>
                    </div>
                `
            })
        } catch (excetpion) {

        }
    }

    findSingleAuthRowByFilter = async (filter) => {
        try {
            return await AuthModel.findOne(filter);
        } catch (exception) {
            throw exception;
        }
    }

}

module.exports = new AuthService(UserModel);
