const authSvc = require('./auth.service');



class AuthController {
    register = async (req, res, next) => {
        try {
            const data = await authSvc.transformUserCreate(req);
            // const user = await authSvc.create(data);
            console.log('about to send email');
            const response =  authSvc.sendActivationEmail(data);
            console.log('email sent');
            console.log('response: ', response);
            res.json({
                message: "User sucessfully created",
                status: "USER_CREATION_SUCCESS",
                // data: user,
                options: null,
                response: response
            })

        } catch (exception) {
            next(exception);
        }
    }
}

module.exports = new AuthController();