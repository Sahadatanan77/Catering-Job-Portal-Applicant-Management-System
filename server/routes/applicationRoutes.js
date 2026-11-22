const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getDashboardStats,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Applicant routes
router.post('/', protect, authorize('applicant'), applyForJob);
router.get('/my', protect, authorize('applicant'), getMyApplications);

// Hirer routes
router.get('/', protect, authorize('hirer'), getAllApplications);
router.get('/stats/dashboard', protect, authorize('hirer'), getDashboardStats);
router.patch('/:id/status', protect, authorize('hirer'), updateApplicationStatus);

module.exports = router;
