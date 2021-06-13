const express = require('express');
const router = express.Router();

const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
const upload = require('../utils/upload.utils').multerUpload('/products/', allowedMimes, 21);
const jwtAuth = require('../middlewares/jwt-auth');

const productController = require('../controller/product.controller');

router.route('/')
  .get(productController.read)
  .post(
    jwtAuth.isAdmin,
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    productController.create
  );
router.route('/:id')
  .get(productController.find)
  .put(productController.update)
  .patch(productController.update)
  .delete(productController.delete);


module.exports = router;
