const puppeteer = require('puppeteer');
const axios = require('axios');
const { parse } = require('tldts');
require('dotenv').config();

async function checkThirdPartyScripts(url) {
  let browser;
  const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  const threatTypes = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];

  try {
    const parsedMain = parse(url);
    const mainDomain = parsedMain.domain;

    if (!mainDomain) {
      return {
        passed: false,
        score: 0,
        message: '❌ Failed to parse main domain'
      };
    }

    browser = await puppeteer.launch({ headless: 'new', timeout: 10000 });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const scriptUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    });

    const thirdPartyUrls = scriptUrls.filter(src => {
      const scriptDomain = parse(src).domain;
      return scriptDomain && scriptDomain !== mainDomain;
    });

    if (thirdPartyUrls.length === 0) {
      return {
        passed: true,
        score: 1,
        message: '✅ No third-party scripts detected'
      };
    }

    // Check each third-party script via Google Safe Browsing
    for (const scriptUrl of thirdPartyUrls) {
      const safeBrowsingRes = await axios.post(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
        {
          client: {
            clientId: "webguardx",
            clientVersion: "1.0.0"
          },
          threatInfo: {
            threatTypes,
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url: scriptUrl }]
          }
        }
      );

      if (safeBrowsingRes.data && safeBrowsingRes.data.matches) {
        return {
          passed: false,
          score: 0,
          message: `❌ Malicious third-party script detected: ${scriptUrl}`
        };
      }
    }

    return {
      passed: true,
      score: 1,
      message: `✅ All ${thirdPartyUrls.length} third-party scripts passed Google Safe Browsing`
    };

  } catch (error) {
    return {
      passed: false,
      score: 0,
      message: `❌ Error checking third-party scripts: ${error.message}`
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkThirdPartyScripts;
