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
  email: { type: String, required: true },
  password: { type: String, required: true },
  guardCode: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
  sessionId: { type: String, default: null },
  refreshToken: { type: String, default: null }, // 🔐 Added for refresh token logic
  history: [historySchema]
});

module.exports = mongoose.model('User', userSchema);
