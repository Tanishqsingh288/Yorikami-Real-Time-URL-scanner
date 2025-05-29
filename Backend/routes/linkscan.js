const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/check', async (req, res) => {
  const urls = req.body.urls;
  const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: 'URLs must be an array' });
  }

  const unsafeUrls = [];

  for (const url of urls) {
    try {
      const safeBrowsingRes = await axios.post(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
        {
          client: {
            clientId: 'webguardx-extension',
            clientVersion: '1.0.0'
          },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }]
          }
        }
      );

      if (safeBrowsingRes.data && safeBrowsingRes.data.matches) {
        unsafeUrls.push(url);
      }
    } catch (error) {
      console.error(`Failed to check: ${url}`, error.message);
    }
  }

  res.json({ unsafeUrls });
});

module.exports = router;
