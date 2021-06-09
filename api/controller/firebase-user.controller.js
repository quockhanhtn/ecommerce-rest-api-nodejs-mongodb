// ref https://github.com/ritikgupt/medium-blog-firebase

const bcrypt = require('bcrypt');
const admin = require("firebase-admin");
const resUtils = require('../utils/res.utils');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.read = (req, res, next) => {
  admin.auth().listUsers(1000)
    .then(docs => {
      resUtils.okResponse(res, '', docs);
    })
    .catch(err => resUtils.errorResponse(res, err));
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = async (req, res, next) => {

  try {
    const user = await admin.auth().getUserByPhoneNumber(req.body.phone)
  } catch (e) {
    res.json({ message: 'no user record found' })
  }
  
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


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {

}