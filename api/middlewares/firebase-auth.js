// ref https://github.com/ritikgupt/medium-blog-firebase

const admin = require("firebase-admin");
const resUtils = require('../utils/res.utils');

exports.checkPhone = async (req, res, next) => {
  try {
    if (!req.body.phone) { throw Error('Missing phone number'); }

    const firebareUser = await admin.auth().getUserByPhoneNumber(req.body.phone);

    if (firebareUser != null) {
      req.body.firebaseUid = firebareUser.uid;
      next();
    } else { throw Error('phone number not verifying!'); }
  } catch (err) {
    resUtils.errorResponse(res, err)
  }
}