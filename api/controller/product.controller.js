const mongoose = require('mongoose');

const resUtils = require('../utils/res.utils');

const Product = require('../models/product.model');


exports.create = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: Number.parseInt(req.body.price) || 0
  });

  if (req.body.description) { product.description = req.body.description; }
  if (req?.file?.path) {
    product.image = req.file.path;
    while (product.image.indexOf('\\') >= 0) {
      product.image = product.image.replace('\\', '/');
    }
  }

  try {
    const newProduct = await product.save();
    resUtils.createdResponse(res, 'Created product successfully!', newProduct);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.read = async (req, res, next) => {
  let _limit = Number.parseInt(req.query._limit) || 10;
  let _page = Number.parseInt(req.query._page) || 1;

  let query = {};
  let options = {
    select: '_id name price createdAt updatedAt',
    offset: _limit * (_page - 1),
    limit: _limit,
  };

  try {
    let results = await Product.paginate(query, options);
    let pagination = {
      page: results.page,
      limit: results.limit,
      offset: results.offset,
      pagingCounter: results.pagingCounter,
      hasNextPage: results.hasNextPage,
      hasPrevPage: results.hasPrevPage,
      nextPage: results.nextPage,
      prevPage: results.prevPage,
      total: results.totalDocs,
      totalPage: results.totalPages
    };

    resUtils.okResponse(res, null, results.data, pagination);

    // resUtils.okResponse(res, null, results);
    // if (results && result.docs.length >= 0) {
    //   res.status(200).json({
    //     success: true,
    //     data: result.docs,
    //     pagination: 
    //   });
    // };
  } catch (err) {
    resUtils.errorResponse(res, err);
  }
}


exports.find = async (req, res, next) => {
  Product.findById(req.params.id)
    .exec()
    .then(docs => {
      if (docs) {
        resUtils.okResponse(res, null, data);
      }
      else {
        resUtils.notFoundResponse(res, 'Not found valid entity for provided Id');
      }
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * PUT /name/:id
 * 
 * PATCH /name/:id
 */
exports.update = async (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  req.body.forEach(ops => updateOps[ops.key] = ops.value);
  updateOps['updatedAt'] = new Date();

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * DELETE /name/:id
 */
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  Product.remove({ _id: id })
    .exec()
    .then(docs => {
      if (docs && docs.n > 0) {
        res.status(200).json({
          success: true,
          data: docs
        });
      }
      else {
        res.status(404).json({
          success: false,
          error: 'Not found valid entity for provided Id'
        });
      }
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}