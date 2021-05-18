const mongoose = require('mongoose');
const resUtils = require('../utils/res.utils');
const Category = require('../model/category.model');


exports.create = (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    isPrimary: req.body.isPrimary,
  });

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
    .select('_id name image isPrimary createdAt updatedAt parent')
    .populate('parent')
    .then(docs => {
      docs.map(category => {
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

      return resUtils.okResponse(res, null, docs);
    })
    .catch(err => resUtils.errorResponse(res, err));
}


exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
