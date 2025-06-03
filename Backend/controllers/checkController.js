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

  let evaluation = null;
  let failed = false;
  let errorMessage = "";

  try {
    const results = [];

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
    evaluation = evaluateResults(results);

    scanCache.set(url, evaluation);

    res.json({
      url,
      status: "completed",
      ...evaluation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    failed = true;
    errorMessage = error.message;
    res.status(500).json({ error: "Server error", message: error.message });
  } finally {
    // Always save to DB even if error
    try {
      const user = await User.findById(req.userId);
      if (user) {
        const historyEntry = {
          url,
          timestamp: new Date(),
          ...(failed
            ? {
                finalScore: 0,
                issues: [`Analysis failed: ${errorMessage}`],
                status: "error",
              }
            : {
                ...evaluation,
                status: "completed",
              }),
        };

        const existingIndex = user.history.findIndex(entry => entry.url === url);
        if (existingIndex !== -1) {
          user.history[existingIndex] = historyEntry;
        } else {
          user.history.push(historyEntry);
        }

        await user.save();
      }
    } catch (dbError) {
      console.error("Failed to save to history:", dbError.message);
    }
  }
}


module.exports = { handleSecurityCheck };
