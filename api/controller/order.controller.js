const mongoose = require('mongoose');

const resUtils = require('../utils/res-utils');

const Order = require('../models/order-model');
const Product = require('../models/product-model');


/**
 * GET /name
 */
exports.getAll = (req, res, next) => {
  Order.find()
    .select('_id product quantity createdAt updatedAt')
    .populate('product')
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * GET /name/:id
 */
exports.getOne = (req, res, next) => {
  const id = req.params.id;

  res.status(200).json({
    message: 'Order detail',
    orderId: id
  });
}


/**
 * POST /name
 */
exports.create = (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then(product => {
      if (!product) {
        throw new Error('Product not found!');
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(docs => {
      if (docs) {
        res.status(200).json(docs);
      }
      else {
        res.status(404).json({
          success: false,
          error: 'Not found valid products for Order'
        });
      }
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * PUT /name/:id
 * 
 * PATCH /name/:id
 */
exports.update = (req, res, next) => {
  const id = req.params.id;

  res.status(200).json({
    message: 'Update order',
    orderId: id
  });
}


/**
 * DELETE /name/:id
 */
exports.delete = (req, res, next) => {
  const id = req.params.id;

  res.status(200).json({
    message: 'Delete order',
    orderId: id
  });
}