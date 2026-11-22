const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location / venue is required'],
      trim: true,
    },
    salary: {
      type: String,
      default: 'Negotiable',
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Part-Time', 'Full-Time', 'Event-Based', 'Shift-Based'],
      default: 'Part-Time',
    },
    vacancies: {
      type: Number,
      default: 5,
      min: [1, 'Must have at least 1 vacancy'],
    },
    eventDate: {
      type: String,
      default: '',
    },
    shiftTimings: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'closed'],
      default: 'active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
