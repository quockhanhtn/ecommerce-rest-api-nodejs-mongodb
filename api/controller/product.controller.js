const mongoose = require('mongoose');

const fs = require('fs');
const resUtils = require('../utils/res.utils');

const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Product = require('../models/product.model');

/**
 * Remove all uploaded image, call it if has error
 */
function deleteImages(req) {
  // delete thumbnail image
  if (req?.files?.thumbnail?.[0]?.path) {
    fs.unlinkSync(req?.files?.thumbnail?.[0]?.path);
  }

  // delete images
  if (req?.files?.images?.length > 0) {
    req?.files?.images.forEach(f => {
      fs.unlinkSync(f.path)
    });
  }
}

function formatImagePath(path) {
  while (path.indexOf('\\') >= 0) {
    path = path.replace('\\', '/');
  }
  return path;
}

function mapImagePath(productList, req) {
  return productList.map(product => {
    if (product.thumbnail) {
      product.thumbnail = `${req.protocol}://${req.get('host')}/${product.thumbnail}`;
    }
    if (product?.images?.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        product.images[i] = `${req.protocol}://${req.get('host')}/${product.images[i]}`;
      }
    }
    return product;
  });
}


exports.create = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      marketPrice: Number.parseInt(req.body.marketPrice) || 0,
      price: Number.parseInt(req.body.price) || 0,
    });

    // product brand
    let brandId = (req.body.brandId) ? req.body.brandId : 0;
    const brandFound = await Brand.findOne({ brandId: brandId }).exec();
    if (brandFound != null) { product.brand = brandFound._id; }

    // product category
    const categoryFound = await Category.findOne({ _id: req.body.categoryId }).exec();
    if (categoryFound != null) { product.category = categoryFound.id; }

    // product description
    if (req.body.description) { product.description = req.body.description; }
    // product types
    if (req.body.productTypes) { product.productTypes = req.body.productTypes.split('\n'); }

    // product thumbnail
    if (req?.files?.thumbnail?.[0]?.path) {
      product.thumbnail = formatImagePath(req?.files?.thumbnail?.[0]?.path);
    }

    // product images
    if (req?.files?.images?.length > 0) {
      let productImages = [];
      req?.files?.images.forEach(x => productImages.push(formatImagePath(x.path)));
      product.images = productImages;
    }

    const newProduct = await product.save();
    resUtils.createdResponse(res, 'Created product successfully!', newProduct);
  } catch (err) {
    deleteImages();
    resUtils.errorResponse(res, err);
  }
}


exports.read = async (req, res, next) => {
  let _limit = Number.parseInt(req.query._limit) || 10;
  let _page = Number.parseInt(req.query._page) || 1;

  let query = {};
  let options = {
    select: '_id productId name slug marketPrice price description categoryId brandId productTypes thumbnail images createdAt updatedAt',
    populate: [
      {
        path: 'category',
        select: '_id name slug description image isPrimary createdAt updatedAt parent',
        model: 'Category'
      },
      {
        path: 'brand',
        select: '_id brandId name slug origin description image createdAt updatedAt',
        model: 'Brand'
      }
    ],
    lean: true,
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
    resUtils.okResponse(res, null, mapImagePath(results.docs, req), pagination);
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