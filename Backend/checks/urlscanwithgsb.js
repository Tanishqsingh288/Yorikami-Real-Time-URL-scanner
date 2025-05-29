const axios = require('axios');
require('dotenv').config();

async function checkWithGoogleSafeBrowsing(url) {
  try {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const body = {
      client: {
        clientId: 'webguardx',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [
          { url } // ✅ full valid URL
        ]
      }
    };

    const response = await axios.post(endpoint, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const threats = response.data.matches;
    const isSafe = !threats || threats.length === 0;

    return {
      passed: isSafe,
      score: isSafe ? 1 : 0,
      message: isSafe
        ? '✅ URL is safe according to Google Safe Browsing'
        : '⚠️ URL is flagged as unsafe by Google Safe Browsing'
    };
  } catch (error) {
    console.error('Google Safe Browsing error:', error.message || error);
    return {
      passed: false,
      score: 0,
      message: 'Failed to check URL using Google Safe Browsing'
    };
  }
}

module.exports = checkWithGoogleSafeBrowsing;
