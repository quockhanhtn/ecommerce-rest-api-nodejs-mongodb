const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user.model');

function catchError(res, err, message) {
  console.log(err);
  res.status(500).json({
    success: false,
    error: err.message
  });
}

function signup(req, res, next) {
  User.find({ email: req.body.email })
    .exec()
    .then(userDocs => {
      if (userDocs.length >= 1) {
        res.status(404).json({
          success: false,
          error: 'Mail exists'
        });
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
    }).catch(err => catchError(res, err));
}

function login(req, res, next) {
  User.find({ email: req.body.email })
    .exec()
    .then(userDocs => {
      if (userDocs.length < 1) {
        return res.status(404).json({
          success: false,
          error: 'Mail not found, user doesn\'t exist'
        });
      } else {
        bcrypt.compare(req.body.password, userDocs[0].password, (err, result) => {
          if (err) {
            catchError(res, err);
          }
          if (result) {
            const token = jwt.sign(
              {
                email: userDocs[0].email,
                userId: userDocs[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              });
            return res.status(200).json({
              success: true,
              message: 'Auth successful!',
              token: token
            });
          }
          res.status(401).json({
            success: false,
            message: 'Auth failed!'
          });
        });
      }
    }).catch(err => catchError(res, err));
}

module.exports = {
  signup,
  login
}