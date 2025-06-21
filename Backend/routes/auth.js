const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  getUserHistory,
  resetPassword,
  deleteUser,
  logoutUser,
  updateEmail,
  refreshAccessToken // ⬅️ added
} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken'); // If you use this, apply it to protected routes

// Public routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshAccessToken); // ⬅️ added

// Protected routes
router.get('/history', verifyToken, getUserHistory); // Example
router.post('/logout', verifyToken, logoutUser);
router.delete('/delete', verifyToken, deleteUser);
router.put('/update-email', verifyToken, updateEmail);

module.exports = router;
