const jwt = require('jsonwebtoken');
const resUtils = require('../utils/res.utils');

function getUserData(req) {
  // Header 'Authorization: Bearer [JWT_TOKEN]'
  const jwtToken = req.headers.authorization.split(' ')[1];
  return jwt.verify(jwtToken, process.env.JWT_KEY);
}

exports.isLogin = (req, res, next) => {
  try {
    req.userData = getUserData(req);;
    next();
  } catch (error) {
    resUtils.unauthorizedResponse(res, 'Auth failed! ' + error);
  }
}

exports.isAdmin = (req, res, next) => {
  try {
    let data = getUserData(req);
    if (data.userType === 'admin') {
      req.userData = data;
      next();
    } else { throw Error('User have not permission for this resource'); }
  } catch (error) {
    resUtils.unauthorizedResponse(res, 'Auth failed! ' + error);
  }
}

exports.isCustomer = (req, res, next) => {
  try {
    let data = getUserData(req);
    if (data.userType === 'custommer') {
      req.userData = data;
      next();
    } else { throw Error('User have not permission for this resource'); }
  } catch (error) {
    resUtils.unauthorizedResponse(res, 'Auth failed! ' + error);
  }
}