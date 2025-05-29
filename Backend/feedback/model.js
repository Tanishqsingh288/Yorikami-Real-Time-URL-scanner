const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
