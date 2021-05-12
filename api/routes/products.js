const express = require('express');
const router = express.Router();

// const allowedMimes = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif'];
// const upload = require('../utils/upload-utils').multerUpload(allowedMimes);

// const checkAuth = require('../middleware/check-auth')
// const productController = require('../controllers/product-controller');


// router.route('/')
//   .get(productController.getAll)
//   .post(
//     checkAuth,
//     upload.single('productImage'),
//     productController.create
//   );
// router.route('/:id')
//   .get(productController.getOne)
//   .put(productController.update)
//   .patch(productController.update)
//   .delete(productController.delete);


module.exports = router;
