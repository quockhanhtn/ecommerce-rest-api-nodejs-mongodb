const express = require('express');
const router = express.Router();

const firebaseAuth = require('../middlewares/firebase-auth');
const jwtAuth = require('../middlewares/jwt-auth');

const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
const upload = require('../utils/upload.utils').multerUpload('/users/', allowedMimes);

const userController = require('../controller/user.controller');


router.route('/info').get(
  jwtAuth.isLogin,
  userController.getInfo
);

router.route('/update')
  .put(
    upload.single('userImage'),
    jwtAuth.isLogin,
    userController.updateInfo
  )
  .patch(
    upload.single('userImage'),
    jwtAuth.isLogin,
    userController.updateInfo
  );

router.route('/signup').post(
  upload.single('userImage'),
  firebaseAuth.checkPhone,
  userController.signup
);
router.route('/login').post(userController.login);


module.exports = router;