const BaseClass = require('../../services/base.service');
const models = require('../../../models/index');

class UserService extends BaseClass {

    getPublicData = user => ({
        name: user.name,
        email: user.email,
        status: user.status,
        iamge: user.image,
    })
}


module.exports = new UserService(models.User);