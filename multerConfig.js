const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // where files are saved
  },
  filename: function (req, file, cb) {
    // filename for image/file
    cb(null, Date.now() + '-' + file.originalname)
  }
});

// Function to filter file types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/avif' ||
    file.mimetype === 'image/webp'
  ) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;