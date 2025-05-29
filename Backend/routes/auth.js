const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  getUserHistory,
  resetPassword,
  resetPasswordWithToken,
  deleteUser,
  logoutUser,
  updateEmail
} = require('../controllers/authController');
const verifySession = require('../middlewares/verifySession');


// ✅ Public Routes
router.post('/signup', signupUser); //Tested OK
router.post('/login', loginUser);   //Tested OK
router.post('/reset-password', resetPassword);    //Tested OK
//router.post('/reset-password/:token', resetPasswordWithToken);     //Tested OK

// ✅ Protected Routes (require valid JWT token)
router.get('/history', verifySession, getUserHistory);    //Tested OK
router.post('/logout', verifySession, logoutUser);     //Tested OK
router.delete('/delete', verifySession, deleteUser);    
router.put('/update-email', verifySession, updateEmail);

module.exports = router;
