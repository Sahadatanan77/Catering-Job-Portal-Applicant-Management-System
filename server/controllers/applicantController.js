const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const Applicant = require('../models/Applicant');
const User = require('../models/User');
const Application = require('../models/Application');
const { uploadFile, deleteFile } = require('../services/cloudinaryService');
const { isValidBdPhone, normalizeBdPhone, validateCvFile, validateImageFile } = require('../utils/fileValidation');

// @desc    Get current applicant's own profile
// @route   GET /api/applicants/profile
// @access  Private (Applicant)
const getOwnProfile = async (req, res, next) => {
  try {
    let applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) {
      // Return a basic profile with user email if not yet filled
      return res.json({
        success: true,
        isNew: true,
        applicant: {
          userId: req.user._id,
          fullName: '',
          phone: '',
          whatsapp: '',
          hometown: '',
          experience: '',
          profilePicture: '',
          cv: { fileName: '', fileUrl: '' },
          additionalPictures: [],
        },
      });
    }

    res.json({
      success: true,
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update applicant profile
// @route   POST or PUT /api/applicants/profile
// @access  Private (Applicant)
const saveProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      whatsapp,
      hometown,
      experience,
      skills,
      bio,
      expectedDailyRate,
    } = req.body;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.',
      });
    }

    // Bangladeshi phone validation check
    if (!isValidBdPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Bangladeshi mobile number (e.g., 017XXXXXXXX, 018XXXXXXXX, +8801XXXXXXXX).',
      });
    }

    // If whatsapp is provided, validate it as well
    if (whatsapp && whatsapp.trim() && !isValidBdPhone(whatsapp)) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp number must be a valid Bangladeshi mobile number (e.g., 017XXXXXXXX).',
      });
    }

    if (!hometown || !hometown.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Hometown / City is required.',
      });
    }

    let applicant = await Applicant.findOne({ userId: req.user._id });

    // Handle parsed skills if string
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const profileData = {
      userId: req.user._id,
      fullName: fullName.trim(),
      phone: normalizeBdPhone(phone),
      whatsapp: whatsapp ? normalizeBdPhone(whatsapp) : normalizeBdPhone(phone),
      hometown: hometown.trim(),
      experience: experience ? experience.trim() : 'Fresh catering candidate',
      bio: bio ? bio.trim() : '',
      skills: Array.isArray(parsedSkills) ? parsedSkills : ['Food Serving', 'Table Setup'],
      expectedDailyRate: expectedDailyRate || 'Negotiable',
    };

    if (applicant) {
      // Update existing profile
      applicant = await Applicant.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      applicant = await Applicant.create(profileData);
    }

    res.json({
      success: true,
      message: 'Applicant profile saved successfully.',
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Profile Picture, CV, and Additional Photos
// @route   POST /api/applicants/upload
// @access  Private (Applicant)
const uploadFiles = async (req, res, next) => {
  try {
    let applicant = await Applicant.findOne({ userId: req.user._id });

    if (!applicant) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your basic profile before uploading documents.',
      });
    }

    // 1. Check Profile Picture upload
    if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
      const picFile = req.files.profilePicture[0];
      const validPic = validateImageFile(picFile);
      if (!validPic.valid) {
        return res.status(400).json({ success: false, message: validPic.message });
      }

      // Delete old profile picture if exists
      if (applicant.profilePicturePublicId) {
        await deleteFile(applicant.profilePicturePublicId, false);
      }

      const uploadedPic = await uploadFile(picFile, 'avatars');
      applicant.profilePicture = uploadedPic.url;
      applicant.profilePicturePublicId = uploadedPic.publicId;
    }

    // 2. Check CV upload
    if (req.files && req.files.cv && req.files.cv[0]) {
      const cvFile = req.files.cv[0];
      const validCv = validateCvFile(cvFile);
      if (!validCv.valid) {
        return res.status(400).json({ success: false, message: validCv.message });
      }

      // Delete old CV if exists
      if (applicant.cv && applicant.cv.publicId) {
        await deleteFile(applicant.cv.publicId, true);
      }

      const uploadedCv = await uploadFile(cvFile, 'cvs');
      applicant.cv = {
        fileName: cvFile.originalname,
        fileUrl: uploadedCv.url,
        publicId: uploadedCv.publicId,
        mimeType: cvFile.mimetype,
        size: cvFile.size,
        uploadedAt: new Date(),
      };
    }

    // 3. Check Additional Pictures (Event photos)
    if (req.files && req.files.additionalPictures && req.files.additionalPictures.length > 0) {
      const currentCount = applicant.additionalPictures ? applicant.additionalPictures.length : 0;
      if (currentCount + req.files.additionalPictures.length > 6) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 6 event/work photos allowed in profile.',
        });
      }

      for (const file of req.files.additionalPictures) {
        const validPhoto = validateImageFile(file);
        if (validPhoto.valid) {
          const uploadedPhoto = await uploadFile(file, 'events');
          applicant.additionalPictures.push({
            url: uploadedPhoto.url,
            publicId: uploadedPhoto.publicId,
            caption: 'Catering event photo',
            uploadedAt: new Date(),
          });
        }
      }
    }

    await applicant.save();

    res.json({
      success: true,
      message: 'Files uploaded and profile updated successfully.',
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants (Hirer / Admin view)
// @route   GET /api/applicants
// @access  Private (Hirer)
const getAllApplicants = async (req, res, next) => {
  try {
    const { search, hometown, experience, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { hometown: { $regex: search, $options: 'i' } },
        { experience: { $regex: search, $options: 'i' } },
      ];
    }

    if (hometown) {
      query.hometown = { $regex: hometown, $options: 'i' };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .populate('userId', 'email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Also get latest application status for each applicant
    const applicantIds = applicants.map((a) => a._id);
    const applications = await Application.find({ applicantId: { $in: applicantIds } })
      .populate('jobId', 'title location')
      .sort({ appliedAt: -1 });

    const applicantsWithApps = applicants.map((app) => {
      const userApps = applications.filter(
        (a) => a.applicantId.toString() === app._id.toString()
      );
      return {
        ...app.toObject(),
        applications: userApps,
        totalApplications: userApps.length,
        latestStatus: userApps[0] ? userApps[0].status : 'unapplied',
      };
    });

    res.json({
      success: true,
      count: applicants.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      applicants: applicantsWithApps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicant details by ID (Hirer view)
// @route   GET /api/applicants/:id
// @access  Private (Hirer)
const getApplicantById = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate('userId', 'email createdAt');

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found.',
      });
    }

    // Find all applications submitted by this applicant
    const applications = await Application.find({ applicantId: applicant._id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applicant,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Secure CV download and preview endpoint
// @route   GET /api/applicants/:id/cv/download
// @access  Private (Hirer or Applicant Owner)
const downloadApplicantCv = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant || !applicant.cv || !applicant.cv.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'No CV has been uploaded by this applicant.',
      });
    }

    // Role-based permission check:
    // Hirer can access any CV; applicant can ONLY access their own CV
    const isHirer = req.user.role === 'hirer';
    const isOwner = applicant.userId.toString() === req.user._id.toString();

    if (!isHirer && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this applicant\'s CV.',
      });
    }

    const { fileUrl, fileName, publicId, mimeType } = applicant.cv;
    const isDownload = req.query.download === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    const cleanFileName = fileName || 'applicant_cv.pdf';
    const contentType = mimeType || (cleanFileName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

    // 1. If Cloudinary or remote URL, stream with proper PDF headers so browser can preview inline
    if (fileUrl && fileUrl.startsWith('http')) {
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `${disposition}; filename="${encodeURIComponent(cleanFileName)}"`
      );

      const client = fileUrl.startsWith('https') ? https : http;
      return client.get(fileUrl, (remoteRes) => {
        if (remoteRes.statusCode >= 400) {
          // If remote streaming returned error, fallback to redirect
          return res.redirect(fileUrl);
        }
        remoteRes.pipe(res);
      }).on('error', (err) => {
        console.error('Error streaming remote CV:', err.message);
        res.redirect(fileUrl);
      });
    }

    // 2. If local file
    const localUploadsDir = path.join(__dirname, '..', 'uploads', 'cvs');
    let localFilePath = path.join(localUploadsDir, publicId);

    // If exact publicId not found, search by fileName
    if (!fs.existsSync(localFilePath) && fs.existsSync(localUploadsDir)) {
      const files = fs.readdirSync(localUploadsDir);
      const match = files.find((f) => f.includes(cleanFileName) || (publicId && f.includes(publicId)));
      if (match) {
        localFilePath = path.join(localUploadsDir, match);
      }
    }

    if (fs.existsSync(localFilePath)) {
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `${disposition}; filename="${encodeURIComponent(cleanFileName)}"`
      );

      const stream = fs.createReadStream(localFilePath);
      return stream.pipe(res);
    }

    return res.status(404).json({
      success: false,
      message: 'CV file could not be located on storage server.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an additional picture
// @route   DELETE /api/applicants/photos/:photoId
// @access  Private (Applicant)
const deletePhoto = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    const photo = applicant.additionalPictures.id(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.publicId) {
      await deleteFile(photo.publicId, false);
    }

    photo.deleteOne();
    await applicant.save();

    res.json({
      success: true,
      message: 'Photo deleted successfully.',
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwnProfile,
  saveProfile,
  uploadFiles,
  getAllApplicants,
  getApplicantById,
  downloadApplicantCv,
  deletePhoto,
};
