const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  url: String,
  pointsEarned: Number,
  totalPossible: Number,
  finalScore: Number,
  rating: String,
  timestamp: Date
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  guardCode: String,
  resetToken: String,
  resetTokenExpiry: Date,
  sessionId: { type: String, default: null },
  history: [historySchema]
});

module.exports = mongoose.model('User', userSchema);
