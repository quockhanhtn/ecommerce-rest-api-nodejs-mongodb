const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Header 'Authorization: Bearer [JWT_TOKEN]'
    const jwtToken = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(jwtToken, process.env.JWT_KEY);
    req.userData = decodedData;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Auth failed!'
    });
  }
}