const Application = require('../models/Application');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// @desc    Apply for a catering job (Applicant)
// @route   POST /api/applications
// @access  Private (Applicant)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverNote } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required to submit an application.',
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Selected job posting does not exist.',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active for applications.',
      });
    }

    // Check applicant profile
    const applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your applicant profile first before applying.',
      });
    }

    if (!applicant.fullName || !applicant.phone || !applicant.hometown) {
      return res.status(400).json({
        success: false,
        message: 'Please ensure your Full Name, Phone Number, and Hometown are set in your profile.',
      });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      applicantId: applicant._id,
      jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this catering job.',
        application: alreadyApplied,
      });
    }

    // Create application with automatic 'pending' status
    const application = await Application.create({
      applicantId: applicant._id,
      userId: req.user._id,
      jobId,
      status: 'pending',
      coverNote: coverNote ? coverNote.trim() : '',
      appliedAt: new Date(),
    });

    const populatedApp = await Application.findById(application._id)
      .populate('jobId')
      .populate('applicantId');

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully! Status is Pending.',
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current applicant's own applications
// @route   GET /api/applications/my
// @access  Private (Applicant)
const getMyApplications = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) {
      return res.json({
        success: true,
        applications: [],
      });
    }

    const applications = await Application.find({ applicantId: applicant._id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Hirer/Admin)
// @route   GET /api/applications
// @access  Private (Hirer)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, jobId, search, page = 1, limit = 25 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.jobId = jobId;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'applicantId',
        populate: { path: 'userId', select: 'email' },
      })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    // Client-side filtering if search query matches applicant name, phone, or job title
    let filtered = applications;
    if (search) {
      const s = search.toLowerCase();
      filtered = applications.filter((app) => {
        const nameMatch = app.applicantId?.fullName?.toLowerCase().includes(s);
        const phoneMatch = app.applicantId?.phone?.includes(s);
        const townMatch = app.applicantId?.hometown?.toLowerCase().includes(s);
        const jobMatch = app.jobId?.title?.toLowerCase().includes(s);
        return nameMatch || phoneMatch || townMatch || jobMatch;
      });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / Number(limit)),
      currentPage: Number(page),
      applications: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Hirer)
// @route   PATCH /api/applications/:id/status
// @access  Private (Hirer)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const allowedStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('applicantId')
      .populate('userId', 'email')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const oldStatus = application.status;
    application.status = status;
    if (notes !== undefined) {
      application.notes = notes;
    }
    await application.save();

    // Notify applicant via simulated or actual email if status changed
    if (application.userId && application.userId.email && oldStatus !== status) {
      sendEmail({
        to: application.userId.email,
        subject: `Update on your application for "${application.jobId?.title}"`,
        text: `Hello ${application.applicantId?.fullName},\n\nYour application status for "${application.jobId?.title}" has been updated to: ${status.toUpperCase()}.\n\nLog in to your dashboard to review details.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h3>Application Status Update</h3>
            <p>Dear <strong>${application.applicantId?.fullName}</strong>,</p>
            <p>Your application for <strong>${application.jobId?.title}</strong> has been updated to:</p>
            <div style="display:inline-block; padding: 8px 16px; border-radius: 4px; font-weight: bold; background: #e0f2fe; color: #0284c7; text-transform: uppercase;">
              ${status}
            </div>
            <p style="margin-top: 20px;">Thank you for your interest in working with our catering team.</p>
          </div>
        `,
      }).catch((e) => console.warn('Email dispatch warning:', e.message));
    }

    res.json({
      success: true,
      message: `Application status updated to '${status}'.`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Hirer / Admin
// @route   GET /api/applications/stats/dashboard
// @access  Private (Hirer)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalApplicants = await Applicant.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const reviewedApplications = await Application.countDocuments({ status: 'reviewed' });
    const shortlistedApplications = await Application.countDocuments({ status: 'shortlisted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const hiredApplications = await Application.countDocuments({ status: 'hired' });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalJobs = await Job.countDocuments();

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('applicantId', 'fullName phone hometown profilePicture experience')
      .populate('jobId', 'title location salary')
      .sort({ appliedAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalApplicants,
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        rejectedApplications,
        hiredApplications,
        activeJobs,
        totalJobs,
      },
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getDashboardStats,
};
