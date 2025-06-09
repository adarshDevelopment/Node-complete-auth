const { Status } = require('../../config/constants.config')
// const models = require('../../../models/index');
const BaseService = require('../../services/base.service');
const emailSvc = require('../../services/email.service');
const { smtpConfig, appConfig } = require('../../config/config')
const { randomStringGenerator } = require('../../utils/helper');
const UserModel = require('../user/user.model');

class AuthService extends BaseService {
    constructor(model) {
        super(model);
    }

    transformUserCreate = async (req) => {
        try {
            const data = req.body;

            data.status = Status.Inactive;

            // check if email already exists
            const user = await models.User.findOne({ where: { email: data.email } });
            if (user) {
                throw {
                    message: "User with the same email already exists",
                    stauts: "DUPLICATE_EMAIL_ADDRESS",
                    code: 409
                }
            }
            // delete confirmPassword
            delete data.confirmPassword;

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
                html: ` <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                        <tr>
                            <td style="padding: 30px; text-align: center;">
                            <h2 style="color: #222;">Activate Your Account</h2>
                            <p style="font-size: 16px; line-height: 1.6;">
                                Please activate your account by clicking the button below.
                            </p>
                            <a href="http://${appConfig.frontendUrl}activate-user/${user.activationToken}" 
                                style="display: inline-block; margin-top: 20px; padding: 12px 25px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                                Activate Account
                            </a>
                            <p style="margin-top: 30px; font-size: 14px; color: #555;">
                                If the button doesn't work, copy and paste the following link into your browser:
                            </p>
                            <p style="word-break: break-all; font-size: 14px; color: #007BFF;">
                                ${appConfig.frontendUrl}activate-user/${user.activationToken}
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

    findSingleRowByFilter = async (filter) => {
        try {
            return await this.model.findOne({ where: filter });
        } catch (exception) {
            throw exception;
        }
    }
}

module.exports = new AuthService(UserModel);
