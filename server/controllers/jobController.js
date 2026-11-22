const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create a new catering job
// @route   POST /api/jobs
// @access  Private (Hirer)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      jobType,
      vacancies,
      eventDate,
      shiftTimings,
      requirements,
      status,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, description, and location.',
      });
    }

    let parsedRequirements = requirements;
    if (typeof requirements === 'string') {
      try {
        parsedRequirements = JSON.parse(requirements);
      } catch {
        parsedRequirements = requirements.split('\n').map((r) => r.trim()).filter(Boolean);
      }
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      salary: salary ? salary.trim() : 'Negotiable',
      jobType: jobType || 'Part-Time',
      vacancies: Number(vacancies) || 5,
      eventDate: eventDate || '',
      shiftTimings: shiftTimings || '',
      requirements: Array.isArray(parsedRequirements) ? parsedRequirements : [],
      status: status || 'active',
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all catering jobs
// @route   GET /api/jobs
// @access  Public (Applicants see active jobs; Hirers can view all)
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, status } = req.query;

    const query = {};

    // If not authenticated or role is applicant, show only active jobs
    const isHirer = req.user && req.user.role === 'hirer';
    if (!isHirer) {
      query.status = 'active';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    // Include applicant counts per job
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });

    const jobsWithCounts = jobs.map((job) => {
      const appCount = applications.filter(
        (a) => a.jobId.toString() === job._id.toString()
      ).length;
      return {
        ...job.toObject(),
        applicationsCount: appCount,
      };
    });

    res.json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    const applicationsCount = await Application.countDocuments({ jobId: job._id });

    res.json({
      success: true,
      job: {
        ...job.toObject(),
        applicationsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a catering job
// @route   PUT /api/jobs/:id
// @access  Private (Hirer)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    const updates = { ...req.body };
    if (typeof updates.requirements === 'string') {
      try {
        updates.requirements = JSON.parse(updates.requirements);
      } catch {
        updates.requirements = updates.requirements.split('\n').map((r) => r.trim()).filter(Boolean);
      }
    }

    job = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Job updated successfully.',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Hirer)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    await job.deleteOne();
    // Also remove related applications
    await Application.deleteMany({ jobId: req.params.id });

    res.json({
      success: true,
      message: 'Job and associated applications removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
