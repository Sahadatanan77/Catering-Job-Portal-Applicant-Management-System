const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Optional auth middleware helper for getJobs so hirer can see all statuses
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('hirer'), createJob);
router.put('/:id', protect, authorize('hirer'), updateJob);
router.delete('/:id', protect, authorize('hirer'), deleteJob);

module.exports = router;
