const UPLOAD_PATH = './public/uploads/';
const MAX_UPLOAD_FILE_SIZE = 1024 * 1024;
const NO_FILE_PER_REQUEST = 1;

const multer = require('multer');

/**
 * Get Multer instance
 * 
 * @param {String[]} allowedMimes 
 * @returns  Multer instance that provides several methods for generating
  * middleware that process files uploaded in `multipart/form-data` format.
 */
function multerUpload(allowedMimes = []) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    }
  });

  const uploadOptions = {
    storage: storage,
    limits: {
      files: NO_FILE_PER_REQUEST,
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