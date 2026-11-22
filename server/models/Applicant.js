const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    hometown: {
      type: String,
      required: [true, 'Hometown / City is required'],
      trim: true,
    },
    experience: {
      type: String,
      default: 'No prior experience specified',
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    profilePicturePublicId: {
      type: String,
      default: '',
    },
    cv: {
      fileName: {
        type: String,
        default: '',
      },
      fileUrl: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
      mimeType: {
        type: String,
        default: '',
      },
      size: {
        type: Number,
        default: 0,
      },
      uploadedAt: {
        type: Date,
      },
    },
    additionalPictures: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          default: '',
        },
        caption: {
          type: String,
          default: '',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: ['Food Serving', 'Table Setup', 'Guest Service'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Applicant', applicantSchema);
