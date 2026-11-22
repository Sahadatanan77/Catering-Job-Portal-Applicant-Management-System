const multer = require('multer');

// Store files in memory buffer so we can stream to Cloudinary or save locally cleanly
const storage = multer.memoryStorage();

// File filter check
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedCvTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file.fieldname === 'profilePicture' || file.fieldname === 'additionalPictures') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP image files are allowed for photos!'), false);
    }
  } else if (file.fieldname === 'cv') {
    if (allowedCvTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV upload!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Middleware configurations
const uploadProfileAndCv = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'additionalPictures', maxCount: 5 },
]);

const uploadSingleCv = upload.single('cv');
const uploadSinglePhoto = upload.single('profilePicture');
const uploadEventPhotos = upload.array('additionalPictures', 5);

module.exports = {
  upload,
  uploadProfileAndCv,
  uploadSingleCv,
  uploadSinglePhoto,
  uploadEventPhotos,
};
