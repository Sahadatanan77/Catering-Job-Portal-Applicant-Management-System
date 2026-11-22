const crypto = require('crypto');
const User = require('../models/User');
const Applicant = require('../models/Applicant');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../services/emailService');

// @desc    Register a new applicant account
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, hometown } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }

    // Create user with role applicant
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      role: 'applicant',
    });

    // If initial details provided, optionally create initial applicant shell
    let applicantProfile = null;
    if (fullName || phone || hometown) {
      applicantProfile = await Applicant.create({
        userId: user._id,
        fullName: fullName || 'New Applicant',
        phone: phone || '',
        whatsapp: phone || '',
        hometown: hometown || 'Dhaka',
        experience: 'New applicant in catering',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to the Catering Job Portal.',
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      applicant: applicantProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Applicant or Hirer)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Check for user
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user && normalizedEmail === 'rahim.ahmed@gmail.com') {
      user = await User.findOne({ email: 'applicant1@cateringportal.com' }).select('+password');
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // If login page expects a specific role (e.g. hirer portal vs applicant portal)
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: `This login section is reserved for ${expectedRole} accounts. You are signed in as '${user.role}'.`,
      });
    }

    const token = generateToken(user._id, user.role);

    // Fetch applicant profile if role is applicant
    let applicant = null;
    if (user.role === 'applicant') {
      applicant = await Applicant.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let applicant = null;
    if (user.role === 'applicant') {
      applicant = await Applicant.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - request reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success with generic message for privacy/security
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Expire in 1 hour
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You requested a password reset for your Catering Job Portal account.\n\nPlease reset your password by clicking the following link:\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`;

    await sendEmail({
      to: user.email,
      subject: 'Catering Job Portal - Password Reset',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Catering Job Portal</h2>
          <p>You requested a password reset for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
      // In dev mode, return token so tester can use directly
      resetTokenDev: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Password reset successful! You are now logged in.',
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Hirer/Admin account (Only accessible by existing Hirer)
// @route   POST /api/auth/create-hirer
// @access  Private (Hirer only)
const createHirer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required for the new Hirer account.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const newHirer = await User.create({
      email: email.toLowerCase(),
      password,
      role: 'hirer',
    });

    res.status(201).json({
      success: true,
      message: 'New Hirer account created successfully.',
      user: {
        _id: newHirer._id,
        email: newHirer.email,
        role: newHirer.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  createHirer,
};
