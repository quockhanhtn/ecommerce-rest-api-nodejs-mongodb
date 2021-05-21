const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resUtils = require('../utils/res.utils');

const admin = require("firebase-admin");

exports.read = (req, res, next) => {
  admin.auth().listUsers(1000)
    .then(docs => {
      resUtils.okResponse(res, '', docs);
    })
    .catch(err => resUtils.errorResponse(res, err));
}

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      resUtils.errorResponse(res, err);
    } else {
      const newUser = {
        email: req.body.email,
        emailVerified: false,
        phoneNumber: req.body.phone,
        password: hash,
        displayName: req.body.name,
        disabled: false
      };

      admin.auth().createUser(newUser)
        .then(docs => {
          resUtils.createdResponse(res, '', docs);
        })
        .catch(_err => resUtils.errorResponse(res, _err));
    }
  });
}

exports.login = (req, res, next) => {

}