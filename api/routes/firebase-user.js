const express = require('express');
const router = express.Router();

const firebaseUserController = require('../controller/firebase-user.controller');

router.route('/').get(firebaseUserController.read);

router.route('/signup').post(firebaseUserController.signup);



module.exports = router;