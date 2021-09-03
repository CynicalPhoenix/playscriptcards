const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid')

/* const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
}; */

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../public/uploads'));
	},
	filename: (req, file, cb) => {
		cb(null, uuid() + path.extname(file.originalname));
	}
});

var uploadFile = multer({ storage: storage/* , fileFilter: imageFilter */ });
module.exports = uploadFile;