const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Signup
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const guardCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const user = new User({ email, password: hashedPassword, guardCode });
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Welcome to Yorikami',
      text: `Welcome! Your guard code is: ${guardCode}`
    });

    res.status(201).json({ message: 'Signup successful. Guard code has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password, guardCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || guardCode !== user.guardCode) {
      return res.status(400).json({ error: 'Invalid credentials or guard code' });
    }

    const sessionId = uuidv4();
    user.sessionId = sessionId;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await transporter.sendMail({
      to: email,
      subject: 'Login Successful - Yorikami',
      text: 'You have successfully logged into your Yorikami account.'
    });

    res.json({ token, sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

// Get history (with session check)
const getUserHistory = async (req, res) => {
  const sessionId = req.headers['x-session-id'];

  try {
    const user = await User.findById(req.userId);
    if (!user || user.sessionId !== sessionId) {
      return res.status(403).json({ error: 'Session mismatch. Please login again.' });
    }

    res.json({ history: user.history });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch history', message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, guardCode } = req.body;

  try {
    // Ensure new password and guard code are provided
    if (!newPassword || !guardCode) {
      return res.status(400).json({ error: 'New password and guard code are required' });
    }

    // Find user by guard code
    const user = await User.findOne({ guardCode });
    if (!user) {
      return res.status(404).json({ error: 'Invalid guard code or user not found' });
    }

    // Check if new password is the same as the old one
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed', message: error.message });
  }
};


// Delete user
const deleteUser = async (req, res) => {
  const { guardCode } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user || user.guardCode !== guardCode) {
      return res.status(403).json({ error: 'Unauthorized or incorrect guard code' });
    }

    await transporter.sendMail({
      to: user.email,
      subject: 'Account Deleted',
      text: 'Your Yorikami account has been successfully deleted.'
    });

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed', message: error.message });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  const { guardCode } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user || user.guardCode !== guardCode) {
      return res.status(403).json({ error: 'Unauthorized or incorrect guard code' });
    }

    user.sessionId = null; // invalidate session
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: 'Logout Notification',
      text: 'You have been successfully logged out from your Yorikami account.'
    });

    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
};

// Update Email
const updateEmail = async (req, res) => {
  const { currentPassword, newEmail, guardCode } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(403).json({ error: 'Incorrect password' });
    if (user.guardCode !== guardCode) return res.status(403).json({ error: 'Invalid guard code' });

    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    await transporter.sendMail({
      to: newEmail,
      subject: 'Email Updated - Yorikami',
      text: `Your account email has been updated from ${oldEmail} to ${newEmail}. Your guard code remains the same.`
    });

    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Email update failed', message: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUserHistory,
  resetPassword,
  //resetPasswordWithToken,
  deleteUser,
  logoutUser,
  updateEmail
};
