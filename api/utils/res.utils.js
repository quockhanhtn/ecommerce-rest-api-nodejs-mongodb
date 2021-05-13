/**
 * Send **200 OK** success status response
 *
 * @param {Response}   res         The Express `Response` object
 * @param {String}     message     Response message
 * @param {JSON}       data        Response data
 * @param {JSON}       pagination  Response pagination
 */
exports.okResponse = (res, message = null, data = null, pagination = null) => {
  const resJsonData = { success: true };

  if (message) { resJsonData.message = message; }
  if (data) { resJsonData.data = data; }
  if (pagination) { resJsonData.pagination = pagination; }

  res.status(200).json(resJsonData);
};


/**
 * Send **201 Created** success status response
 *
 * @param {Response}   res         The Express `Response` object
 * @param {String}     message     Response message
 * @param {JSON}       data        Response data
 */
exports.createdResponse = (res, message, data = null) => {
  const resJsonData = {
    success: true,
    message: message
  };

  if (data) { resJsonData.data = data; }

  res.status(201).json(resJsonData);
};


/**
 * Send **400 Bad Request** response (validation Error Response)
 * 
 * @param {Response}   res        The Express `Response` object
 * @param {String}     message    Response message
 * @param {JSON}       data       Response data
 */
exports.validationErrorResponse = (res, message, data) => {
  res.status(400).json({
    success: false,
    message: message,
    data: data
  });
};


/**
 * Send **401 Unauthorized** client error status response
 * 
 * @param {Response}   res        The Express `Response` object
 * @param {String}     message    Response message
 */
exports.unauthorizedResponse = (res, message = 'Auth failed!') => {
  res.status(401).json({
    status: 0,
    message: message,
  });
};


/**
 * Send **404 Not Found** client error response
 *
 * @param {Response}   res        The Express `Response` object
 * @param {String}     message     Response message, default: 'Not found!'
 */
exports.notFoundResponse = (res, message = 'Not found!') => {
  res.status(404).json({
    success: false,
    message: message
  });
};


/**
 * Send **405 Method Not Allowed response** client error response
 *
 * @param {Response}   res        The Express `Response` object
 * @param {String}     message     Response message, default: 'Method not allowed!'
 */
exports.methodNotAllowResponse = (res, message = 'Method not allowed!') => {
  res.status(405).json({
    success: false,
    message: message
  });
};


/**
 * Send **500 Internal Server Error** server error response
 *
 * @param {Response}   res         The Express `Response` object
 * @param {Error}      err         Response message
 */
exports.errorResponse = (res, err) => {
  res.status(500).json({
    success: false,
    message: err.message,
    detail: err
  });
};
