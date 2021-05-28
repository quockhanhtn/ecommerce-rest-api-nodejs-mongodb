const mongoose = require('mongoose');
const resUtils = require('../utils/res.utils');
const Brand = require('../models/brand.model');

const SELECT_FIELD = 'brandId name slug origin description image createdAt updatedAt'

function mapBrandImage(brandsList, req) {
  return brandsList.map(b => {
    if (b.image) {
      b.image = req.protocol + '://' + req.get('host') + '/' + b.image;
    }
    return b;
  });
}


exports.create = async (req, res, next) => {
  const brand = new Brand({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });

  if (req.body.description) { brand.description = req.body.description; }
  if (req.body.origin) { brand.origin = req.body.origin; }
  if (req?.file?.path) {
    brand.image = req.file.path;
    while (brand.image.indexOf('\\') >= 0) {
      brand.image = brand.image.replace('\\', '/');
    }
  }

  try {
    let newBrand = await brand.save();
    resUtils.createdResponse(res, 'Create brand successfully!', newBrand);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.read = async (req, res, next) => {
  try {
    let brands = await Brand.find().select(SELECT_FIELD).exec();
    brands = mapBrandImage(brands, req);
    resUtils.okResponse(res, null, brands)
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}

exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
