const express = require('express');
const router = express.Router();

const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
const upload = require('../utils/upload.utils').multerUpload(allowedMimes);
const auth = require('../middlewares/auth');

const categoryController = require('../controller/category.controller');


router.route('/')
  .get(categoryController.read)
  .post(
    upload.single('categoryImage'),
    categoryController.create
  );

module.exports = router;