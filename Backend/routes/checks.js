const express = require('express');
const router = express.Router();
const { handleSecurityCheck } = require('../controllers/checkController');
const { verifyToken } = require('../middlewares/authMiddleware');
const verifySession = require('../middlewares/verifySession');

router.post('/analyze', verifySession, handleSecurityCheck);

module.exports = router