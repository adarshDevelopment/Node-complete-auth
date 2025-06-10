const router = require('express').Router();
const userController = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

router.get('/', auth(), userController.getLoggedInUserDetail);

module.exports = router;