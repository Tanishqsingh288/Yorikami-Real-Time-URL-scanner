const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens'); // ⬅️ Added

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
      subject: 'Welcome to Yorikami - Your Account is Ready',
      html: `
        <h2>Welcome to Yorikami!</h2>
        <p>We're excited to have you join our community.</p>
        <p>Your unique <strong>Guard Code</strong> is: <strong>${guardCode}</strong></p>
        <p>Please keep this code safe. It is required for secure actions like login, password reset, and account deletion.</p>
        <br/>
        <p>Enjoy exploring Yorikami!</p>
        <hr/>
        <p style="font-size:12px;color:#888;">Need help? Contact support@yorikami.com</p>
      `
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

    const accessToken = generateAccessToken(user._id);            // ⬅️ Access Token
    const refreshToken = generateRefreshToken(user._id);          // ⬅️ Refresh Token
    user.refreshToken = refreshToken;                             // ⬅️ Store refresh token
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Login Successful - Yorikami',
      html: `
        <h2>Login Notification</h2>
        <p>You have successfully logged into your <strong>Yorikami</strong> account.</p>
        <p>If this wasn't you, we recommend resetting your password immediately using your guard code.</p>
        <br/>
        <p>Stay safe,<br/>The Yorikami Team</p>
      `
    });

    res.json({ token: accessToken, refreshToken, sessionId }); // ⬅️ Send both tokens
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
    if (!newPassword || !guardCode) {
      return res.status(400).json({ error: 'New password and guard code are required' });
    }

    const user = await User.findOne({ guardCode });
    if (!user) {
      return res.status(404).json({ error: 'Invalid guard code or user not found' });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await transporter.sendMail({
      to: user.email,
      subject: 'Your Yorikami Password Has Been Reset',
      html: `
        <h2>Hello from Yorikami</h2>
        <p>We wanted to let you know that your password has been <strong>successfully updated</strong>.</p>
        <p>If you did not request this change, please contact our support team immediately.</p>
        <p><strong>Guard Code:</strong> ${guardCode}</p>
        <br/>
        <p>Thank you for staying secure with Yorikami.</p>
        <hr/>
        <p style="font-size:12px;color:#888;">This is an automated message. Please do not reply directly to this email.</p>
      `
    });

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
      subject: 'Your Yorikami Account Has Been Deleted',
      html: `
        <h2>Account Deletion Confirmation</h2>
        <p>We’re confirming that your Yorikami account has been permanently deleted.</p>
        <p>If you did not request this, please reach out to us immediately.</p>
        <br/>
        <p>We’re sorry to see you go.</p>
        <hr/>
        <p style="font-size:12px;color:#888;">If this was a mistake, you may register again anytime at yorikami.com</p>
      `
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

    user.sessionId = null;
    user.refreshToken = null; // ⬅️ Invalidate refresh token
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: 'Logout Confirmation - Yorikami',
      html: `
        <h2>You Have Logged Out</h2>
        <p>This is to confirm that you've successfully logged out of your Yorikami account.</p>
        <p>If this wasn't you, we recommend checking your security settings.</p>
        <br/>
        <p>Thank you for using Yorikami.</p>
      `
    });

    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
};

// 🔁 Refresh Token Handler
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Refresh token expired or invalid' });
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
      subject: 'Email Address Updated - Yorikami',
      html: `
        <h2>Your Yorikami Email Has Been Updated</h2>
        <p>Your account email was changed from <strong>${oldEmail}</strong> to <strong>${newEmail}</strong>.</p>
        <p>Your <strong>Guard Code</strong> remains unchanged: <strong>${guardCode}</strong></p>
        <p>If you didn’t make this change, please contact us immediately.</p>
        <br/>
        <p>Stay secure,<br/>The Yorikami Team</p>
      `
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
  deleteUser,
  logoutUser,
  updateEmail,
  refreshAccessToken // ⬅️ Exported new refresh handler
};
