const mongoose = require('mongoose');

const resUtils = require('../utils/res.utils');
const Country = require('../model/country.model');


exports.create = (req, res, next) => {
  const country = new Country({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    nativeName: req.body.nativeName,
    alpha2Code: req.body.alpha2Code,
    alpha3Code: req.body.alpha3Code,
    region: req.body.region,
    subregion: req.body.subregion,
    imageBase64: req.body.imageBase64,
  });

  if (req.body.callingCodes.length === 1) {
    country.callingCodes = req.body.callingCodes[0];
  } else {
    country.callingCodes = req.body.callingCodes.join(', ');
  }

  country.save()
    .then(docs => {
      if (docs) {
        resUtils.createdResponse(res, 'Create country successfully!', docs);
      } else { throw Error('Error when insert country'); }
    })
    .catch(err => resUtils.errorResponse(res, err));
}


exports.read = (req, res, next) => {
  Country.find()
    .select('_id name nativeName alpha2Code alpha3Code callingCodes region subregion imageBase64')
    .then(docs => resUtils.okResponse(res, null, docs))
    .catch(err => resUtils.errorResponse(res, err));
}


exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
