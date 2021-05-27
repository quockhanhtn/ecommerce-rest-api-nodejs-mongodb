const mongoose = require('mongoose');

const resUtils = require('../utils/res.utils');
const Country = require('../model/country.model');


exports.create = async (req, res, next) => {
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

  try {
    let newCountry = await country.save();
    resUtils.createdResponse(res, 'Create country successfully!', newCountry);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.read = (req, res, next) => {
  try {
    const selectField = '_id name nativeName alpha2Code alpha3Code callingCodes region subregion imageBase64';
    const countries = Country.find(selectField).select().exec();
    resUtils.okResponse(res, null, countries);
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}


exports.update = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
exports.delete = (req, res, next) => resUtils.methodNotAllowResponse(res, 'Method not allow!');
