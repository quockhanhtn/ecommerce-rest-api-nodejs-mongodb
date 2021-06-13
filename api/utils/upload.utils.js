const ROOT_UPLOAD_PATH = './public/uploads';
const MAX_UPLOAD_FILE_SIZE = 1024 * 1024;

const multer = require('multer');

/**
 * Remove accents in String
 * 
 * Ref: https://www.tunglt.com/2018/11/bo-dau-tieng-viet-javascript-es6/
 * @param {String} str 
 * @returns String without accents
 */
function removeAccents(str) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}


/**
 * Get Multer instance
 * 
 * @param {String}        customPath 
 * @param {allowedMimes}  allowedMimes 
 * @param {Number}        filePerReq Maximum number of parts (non-file fields + files). (Default: 1)
 * @returns Multer instance that provides several methods for generating
 * middleware that process files uploaded in `multipart/form-data` format.
 */
function multerUpload(customPath, allowedMimes = [], filePerReq = 1) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ROOT_UPLOAD_PATH + customPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + removeAccents(file.originalname));
    }
  });

  const uploadOptions = {
    storage: storage,
    limits: {
      files: filePerReq,
      fileSize: MAX_UPLOAD_FILE_SIZE
    }
  }

  if (allowedMimes && allowedMimes.length > 0) {
    uploadOptions.fileFilter = (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        // allow supported image files
        cb(null, true);
      } else {
        // throw error for invalid files
        cb(new Error('Invalid file type'));
      }
    };
  }

  return multer(uploadOptions);
}

module.exports = {
  multerUpload
}