const express = require('express');
const router = express.Router();

const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
const upload = require('../utils/upload.utils').multerUpload('/categories/', allowedMimes);
const jwtAuth = require('../middlewares/jwt-auth');

const categoryController = require('../controller/category.controller');


router.route('/')
  .get(categoryController.read)
  .post(
    jwtAuth.isAdmin,
    upload.single('categoryImage'),
    categoryController.create
  );

router.route('/:id/subs')
  .get(categoryController.readSubs);

module.exports = router;