// controllers/userController.js

const User = require('../models/User');
const {
  sortByRiskHighToLow,
  sortByRiskLowToHigh,
  sortByRecentFirst,
  sortByOldestFirst
} = require('../utils/sorting');

const getSortedByRiskHighToLow = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sorted = sortByRiskHighToLow(user.history);
    res.json({ sortedHistory: sorted });
  } catch (error) {
    res.status(500).json({ error: 'Error sorting history', message: error.message });
  }
};

const getSortedByRiskLowToHigh = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sorted = sortByRiskLowToHigh(user.history);
    res.json({ sortedHistory: sorted });
  } catch (error) {
    res.status(500).json({ error: 'Error sorting history', message: error.message });
  }
};

const getSortedByRecentFirst = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sorted = sortByRecentFirst(user.history);
    res.json({ sortedHistory: sorted });
  } catch (error) {
    res.status(500).json({ error: 'Error sorting history', message: error.message });
  }
};

const getSortedByOldestFirst = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sorted = sortByOldestFirst(user.history);
    res.json({ sortedHistory: sorted });
  } catch (error) {
    res.status(500).json({ error: 'Error sorting history', message: error.message });
  }
};

const getPaginatedHistory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 35;
  const skip = (page - 1) * limit;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalHistory = user.history.length;
    const totalPages = Math.ceil(totalHistory / limit);
    const paginated = user.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + limit);

    res.json({
      page,
      limit,
      totalPages,
      totalHistory,
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving paginated history', message: error.message });
  }
};

module.exports = {
  getSortedByRiskHighToLow,
  getSortedByRiskLowToHigh,
  getSortedByRecentFirst,
  getSortedByOldestFirst,
  getPaginatedHistory
};
