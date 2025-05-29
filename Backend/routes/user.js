const express = require('express');
const router = express.Router();
const verifySession = require('../middlewares/verifySession');
const {
  getSortedByRiskHighToLow,
  getSortedByRiskLowToHigh,
  getSortedByRecentFirst,
  getSortedByOldestFirst
} = require('../controllers/userController');
const { reanalyzeUrl,
  deleteUrlFromHistory 
} = require('../controllers/crudController');

const { getPaginatedHistory } = require('../controllers/userController');


// Routes for different User Interactions
router.get('/history/risk/high-to-low', verifySession, getSortedByRiskHighToLow);
router.get('/history/risk/low-to-high', verifySession, getSortedByRiskLowToHigh);
router.get('/history/time/recent-first', verifySession, getSortedByRecentFirst);
router.get('/history/time/oldest-first', verifySession, getSortedByOldestFirst);
router.get('/history/paginated', verifySession, getPaginatedHistory);
router.post('/reanalyze', verifySession, reanalyzeUrl);
router.delete('/delete-url', verifySession, deleteUrlFromHistory);


module.exports = router;





