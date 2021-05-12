const { json } = require('body-parser');
const mongoose = require('mongoose');

const Country = require('../model/country.model');

function catchError(res, err, message) {
  console.log(err);
  res.status(500).json({
    success: false,
    error: err.message
  });
}


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
        res.status(201).json({
          success: true,
          message: 'Create country successfully!',
          data: docs
        });
      }
      else { throw Error('Error when insert country'); }
    })
    .catch(err => catchError(res, err));
}

exports.read = (req, res, next) => {
  Country.find()
    .then(docs => {
      res.status(200).json({
        success: true,
        data: docs
      });
    })
    .catch(err => catchError(res, err));
}

exports.update = (req, res, next) => {
  res.status(405).json({
    status: false,
    message: 'Method not allow!'
  });
}

exports.delete = (req, res, next) => {
  res.status(405).json({
    status: false,
    message: 'Method not allow!'
  });
}