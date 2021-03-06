const express = require('express');
const router = express.Router();

const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
const upload = require('../utils/upload.utils').multerUpload('/brands/', allowedMimes);
const jwtAuth = require('../middlewares/jwt-auth');

const brandController = require('../controller/brand.controller');


router.route('/')
  .get(brandController.read)
  .post(
    jwtAuth.isAdmin,
    upload.single('brandImage'),
    brandController.create
  );

module.exports = router;