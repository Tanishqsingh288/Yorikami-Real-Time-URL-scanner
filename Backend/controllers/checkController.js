const { evaluateResults } = require("../models/CheckResult");
const { v4: uuidv4 } = require('uuid');

const checkHttps = require('../checks/httpscheck');
const checkSSL = require('../checks/sslcheck');
const checkGoogleSafeBrowsing = require('../checks/urlscanwithgsb');
const checkDomainAuthenticity = require('../checks/tlddomaincheck');
const checkSuspiciousContent = require('../checks/suscontentcheck');
const checkUnwantedDownloads = require('../checks/unwanteddownloadcheck');
const checkRedirects = require('../checks/redirectcheck');
const checkWhoisInfo = require('../checks/whoischcek');
const checkMixedContent = require('../checks/nomixedcontentcheck');
const checkThirdPartyScripts = require('../checks/thirdpartyscriptscheck');

const User = require("../models/User");
const NodeCache = require("node-cache");

const scanCache = new NodeCache({ stdTTL: 0 }); // Cache TTL = Permanent

async function handleSecurityCheck(req, res) {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Check cache first
  const cached = scanCache.get(url);
  if (cached) {
    return res.json({
      url,
      status: "cached",
      ...cached,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const results = [];

    // Run all checks in parallel
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

    results.push(...checks);

    // Final evaluation
    const evaluation = evaluateResults(results);

    // Save to cache
    scanCache.set(url, evaluation);

    // Save to user history if logged in
    const user = await User.findById(req.userId);
    if (user) {
      const existingIndex = user.history.findIndex(entry => entry.url === url);
      if (existingIndex !== -1) {
        const existingEntry = user.history[existingIndex];
        if (existingEntry.finalScore !== evaluation.finalScore) {
          user.history[existingIndex] = { url, ...evaluation, timestamp: new Date() };
        } // else, do nothing to avoid duplicate
      } else {
        user.history.push({ url, ...evaluation, timestamp: new Date() });
      }
      await user.save();
    }

    // Return response
    res.json({
      url,
      status: "completed",
      ...evaluation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
}

module.exports = { handleSecurityCheck };
