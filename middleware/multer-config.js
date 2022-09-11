const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
  'image/jpg': '',
  'image/jpeg': '',
  'image/png': ''
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback (null, "./images/");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, Date.now() + path.extname(file.originalname) + extension);
  },
});

const upload = multer({storage: storage});

module.exports = upload