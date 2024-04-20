const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // where files are saved
  },
  filename: function (req, file, cb) {
    // filename for image/file
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

module.exports = upload;