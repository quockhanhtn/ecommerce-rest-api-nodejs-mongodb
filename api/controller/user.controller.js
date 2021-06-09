const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resUtils = require('../utils/res.utils');
const User = require('../models/user.model');


exports.signup = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(userDocs => {
      if (userDocs.length >= 1) {
        resUtils.notFoundResponse(res, 'Mail exists')
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            catchError(res, err);
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(docs => {
                console.log(docs);
                return res.status(200).json({
                  success: true,
                  message: 'created user'
                });
              })
              .catch(_err => catchError(res, _err));
          }
        });
      }
    })
    .catch(err => resUtils.errorResponse(res, err));
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(userFound => {
      if (userFound.length < 1) {
        resUtils.notFoundResponse(res, 'User doesn\'t exist');
      } else {
        bcrypt.compare(req.body.password, userFound.password, (err, result) => {
          if (err) { throw new Error(err.message); }
          if (result) {
            const token = jwt.sign(
              {
                email: userFound.email,
                userId: userFound._id,
                userType: userFound.userType
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              });
            resUtils.okResponse(res, 'Auth successful!', { token: token });
          } else {
            resUtils.unauthorizedResponse(res, 'Auth failed!');
          }
        });
      }
    })
    .catch(err => resUtils.errorResponse(res, err));
}