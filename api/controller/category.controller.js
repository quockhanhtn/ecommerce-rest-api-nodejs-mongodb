const mongoose = require('mongoose');
const resUtils = require('../utils/res.utils');
const Category = require('../models/category.model');

const SELECT_FIELD = '_id name slug description image isPrimary createdAt updatedAt parent'

function mapCategoryImage(categoriesList, req) {
  return categoriesList.map(category => {
    if (category.image) {
      category.image = `${req.protocol}://${req.get('host')}/${category.image}`;
    }
    let cParent = category.parent;
    while (cParent) {
      if (cParent.image && !cParent.image.startsWith(req.protocol)) {
        cParent.image = `${req.protocol}://${req.get('host')}/${cParent.image}`;
      }
      cParent = cParent.parent;
    }
    return category;
  });
}


exports.create = async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    isPrimary: req.body.isPrimary,
  });

  if (req.body.description) { category.description = req.body.description; }
  if (req.body.parent) { category.parent = req.body.parent; }
  if (req?.file?.path) {
    category.image = req.file.path;
    while (category.image.indexOf('\\') >= 0) {
      category.image = category.image.replace('\\', '/');
    }
  }

  try {
    const newCategory = await category.save();
    resUtils.createdResponse(res, 'Create category successfully!', newCategory);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.read = async (req, res, next) => {
  try {
    let categories = await Category.find().select(SELECT_FIELD).lean().exec();
    categories = mapCategoryImage(categories, req);
    let mainCategories = categories.filter(x => !x.parent);

    for (let mainCat of mainCategories) {
      mainCat.children = categories.filter(x => x.parent == mainCat._id)
        .map(category => {
          delete category.parent;
          return category;
        });
    }
    resUtils.okResponse(res, null, mainCategories);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.readSubs = async (req, res, next) => {
  try {
    const id = req.params.id;
    let categories = await Category.find({ parent: id }).select(SELECT_FIELD).exec()
    categories = mapCategoryImage(categories, req)
    resUtils.okResponse(res, null, categories);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
