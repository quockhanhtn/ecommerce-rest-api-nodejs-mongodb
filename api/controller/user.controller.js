const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resUtils = require('../utils/res.utils');
const User = require('../models/user.model');


/**
 * api/user/info 
 */
exports.getInfo = async (req, res, next) => {
  resUtils.okResponse(res, '', req.userData);
}


exports.signup = async (req, res, next) => {
  try {
    const userFound = await User.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    }).exec();

    if (userFound != null) { throw Error('User exists'); }

    let hashPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firebaseUid: req.body.firebaseUid,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPassword
    });

    if (req.body.firstName) { user.firstName = req.body.firstName; }
    if (req.body.lastName) { user.lastName = req.body.lastName; }
    if (parseInt(req.body.gender) < 3) { user.gender = parseInt(req.body.gender); }

    if (req?.file?.path) {
      user.image = req.file.path;
      while (user.image.indexOf('\\') >= 0) {
        user.image = user.image.replace('\\', '/');
      }
    }

    const saveResult = await user.save();

    if (saveResult) {
      resUtils.createdResponse(res, 'Sign in successfully!', saveResult);
    }
  } catch (err) {
    resUtils.errorResponse(res, err);
  }
}

exports.login = async (req, res, next) => {
  try {
    if (!req.body.email && !req.body.phone) {
      throw Error('Email or phone number is missing!');
    }

    const userFound = await User.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    }).exec();

    if (userFound == null) { throw Error('User doesn\'t exist'); }

    const isValidPassword = bcrypt.compareSync(req.body.password, userFound.password);

    if (isValidPassword) {
      const token = jwt.sign(
        {
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          gender: userFound.gender,

          email: userFound.email,
          phone: userFound.phone,
          image: req.protocol + '://' + req.get('host') + '/' + userFound.image,
          userId: userFound._id,
          userType: userFound.userType
        },
        process.env.JWT_KEY,
        { expiresIn: "30d" }
      );
      resUtils.okResponse(res, 'Auth successful!', { token: token });
    } else { throw Error('Password is incorrect!'); }
  } catch (err) {
    resUtils.errorResponse(res, err);
  }
}