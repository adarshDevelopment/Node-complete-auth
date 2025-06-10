const BaseClass = require('../../services/base.service');
const UserModel = require('./user.model');

class UserService extends BaseClass {

    getPublicData = user => ({
        name: user.name,
        email: user.email,
        status: user.status,
        iamge: user.image,
        role: user.role
    });

}


module.exports = new UserService(UserModel);