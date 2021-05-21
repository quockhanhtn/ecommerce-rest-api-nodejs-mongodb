const mongoose = require('mongoose');
const resUtils = require('../utils/res.utils');
const Category = require('../model/category.model');

const SELECT_FIELD = '_id name slug description image isPrimary createdAt updatedAt parent'

function mapCategoryImage(categoriesList, req) {
  return categoriesList.map(category => {
    if (category.image) {
      category.image = req.protocol + '://' + req.get('host') + '/' + category.image;
    }
    let cParent = category.parent;
    while (cParent) {
      if (cParent.image && !cParent.image.startsWith(req.protocol)) {
        cParent.image = req.protocol + '://' + req.get('host') + '/' + cParent.image;
      }
      cParent = cParent.parent;
    }
    return category;
  });
}


exports.create = (req, res, next) => {
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

  category.save()
    .then(docs => {
      if (docs) {
        resUtils.createdResponse(res, 'Create category successfully!', docs);
      } else { throw Error('Error when insert category'); }
    })
    .catch(err => resUtils.errorResponse(res, err));
}


exports.read = (req, res, next) => {
  Category.find()
    .select(SELECT_FIELD)
    .populate('parent')
    .then(docs => {
      docs = mapCategoryImage(docs, req);
      return resUtils.okResponse(res, null, docs);
    })
    .catch(err => resUtils.errorResponse(res, err));
}

exports.readSubs = (req, res, next) => {
  const id = req.params.id;

  Category.find({ parent: id })
    .select(SELECT_FIELD)
    .populate('parent')
    .then(docs => {
      docs = mapCategoryImage(docs, req);
      return resUtils.okResponse(res, null, docs);
    })
    .catch(err => resUtils.errorResponse(res, err));
}



exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
