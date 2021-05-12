const mongoose = require('mongoose');

const resUtils = require('../utils/res-utils');

const Product = require('../models/product-model');


/**
 * GET /name
 */
exports.getAll = (req, res, next) => {
  let _limit = Number.parseInt(req.query._limit) || 10;
  let _page = Number.parseInt(req.query._page) || 1;

  let query = {};
  let options = {
    select: '_id name price createdAt updatedAt',
    offset: _limit * (_page - 1),
    limit: _limit,
  };

  Product.paginate(query, options)
    .then(result => {
      if (result?.docs && result.docs.length >= 0) {
        res.status(200).json({
          success: true,
          data: result.docs,
          pagination: {
            page: result.page,
            limit: result.limit,
            offset: result.offset,
            pagingCounter: result.pagingCounter,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            total: result.totalDocs,
            totalPage: result.totalPages
          }
        });
      } else {
        resUtils.notFoundResponse(res, 'No entities found');
      }
    })
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * GET /name/:id
 */
exports.getOne = (req, res, next) => {
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
 * POST /name
 */
exports.create = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: Number.parseInt(req.body.price) || 0
  });

  if (req?.file?.path) {
    product.image = req.file.path;
  }

  product.save()
    .then(docs => resUtils.createdResponse(res, null, docs))
    .catch(err => resUtils.errorResponse(res, err.message));
}


/**
 * PUT /name/:id
 * 
 * PATCH /name/:id
 */
exports.update = (req, res, next) => {
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
exports.delete = (req, res, next) => {
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