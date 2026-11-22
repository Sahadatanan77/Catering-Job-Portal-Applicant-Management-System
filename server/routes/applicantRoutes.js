const express = require('express');
const router = express.Router();
const {
  getOwnProfile,
  saveProfile,
  uploadFiles,
  getAllApplicants,
  getApplicantById,
  downloadApplicantCv,
  deletePhoto,
} = require('../controllers/applicantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { uploadProfileAndCv } = require('../middleware/uploadMiddleware');

// Applicant own profile routes
router.get('/profile', protect, getOwnProfile);
router.post('/profile', protect, saveProfile);
router.put('/profile', protect, saveProfile);
router.post('/upload', protect, uploadProfileAndCv, uploadFiles);
router.delete('/photos/:photoId', protect, deletePhoto);

// CV download & preview endpoint (both hirer and applicant owner permitted)
router.get('/:id/cv/download', protect, downloadApplicantCv);

// Hirer / Admin applicant management routes
router.get('/', protect, authorize('hirer'), getAllApplicants);
router.get('/:id', protect, authorize('hirer'), getApplicantById);

module.exports = router;
