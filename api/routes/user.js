const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');


router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);


module.exports = router;