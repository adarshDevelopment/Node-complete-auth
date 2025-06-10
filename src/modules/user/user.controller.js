const userSvc = require('./user.service')

class UserController {
    getLoggedInUserDetail = async (req, res, next) => {

        try {
            const user = req.loggedInUser;
            const publicUserDetail = userSvc.getPublicData(user);
            res.json({
                data: publicUserDetail,
                message: 'User successfully fetched',
                status: 'USER_FETCH_SUCCESS',
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }
}

module.exports = new UserController();