const User = require('../models/User');
const { evaluateResults } = require('../models/CheckResult');

const checkHttps = require('../checks/httpscheck');
const checkSSL = require('../checks/sslCheck');
const checkGoogleSafeBrowsing = require('../checks/urlscanwithgsb');
const checkDomainAuthenticity = require('../checks/tlddomaincheck');
const checkSuspiciousContent = require('../checks/suscontentcheck');
const checkUnwantedDownloads = require('../checks/unwanteddownloadcheck');
const checkRedirects = require('../checks/redirectcheck');
const checkWhoisInfo = require('../checks/whoischcek');
const checkMixedContent = require('../checks/nomixedcontentcheck');
const checkThirdPartyScripts = require('../checks/thirdpartyscriptscheck');

// ✅ Re-analyze a URL
const reanalyzeUrl = async (req, res) => {
  const { url } = req.body;
  const userId = req.userId;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const user = await User.findById(userId);
    const historyIndex = user.history.findIndex(entry => entry.url === url);

    if (historyIndex === -1) {
      return res.status(404).json({ error: 'URL not found in history' });
    }

    // Run all checks again
    const checks = await Promise.all([
      Promise.resolve(checkHttps(url)),
      checkSSL(url),
      checkGoogleSafeBrowsing(url),
      checkDomainAuthenticity(url),
      checkRedirects(url),
      checkSuspiciousContent(url),
      checkUnwantedDownloads(url),
      checkWhoisInfo(url),
      checkMixedContent(url),
      checkThirdPartyScripts(url),
    ]);

    const evaluation = evaluateResults(checks);

    const existing = user.history[historyIndex];

    if (existing.finalScore !== evaluation.finalScore) {
      // Update the existing entry
      user.history[historyIndex] = {
        ...existing.toObject(), // keep serial & timestamp if needed
        url,
        ...evaluation,
        timestamp: new Date()
      };
      await user.save();

      return res.json({
        message: 'URL reanalyzed and updated due to score change.',
        updated: true,
        url,
        newScore: evaluation.finalScore,
        rating: evaluation.rating
      });
    }

    return res.json({
      message: 'URL reanalyzed — no changes in score.',
      updated: false,
      url,
      currentScore: evaluation.finalScore,
      rating: evaluation.rating
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to reanalyze URL', details: error.message });
  }
};

// ✅ Delete URL from user history
const deleteUrlFromHistory = async (req, res) => {
  const { url } = req.body;
  const userId = req.userId;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const user = await User.findById(userId);
    const beforeCount = user.history.length;

    user.history = user.history.filter(entry => entry.url !== url);
    const afterCount = user.history.length;

    if (beforeCount === afterCount) {
      return res.status(404).json({ error: 'URL not found in history' });
    }

    await user.save();

    res.json({
      message: 'URL successfully deleted from history',
      deletedUrl: url
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete URL', details: error.message });
  }
};

module.exports = {
  reanalyzeUrl,
  deleteUrlFromHistory
};
