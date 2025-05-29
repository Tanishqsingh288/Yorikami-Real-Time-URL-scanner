const puppeteer = require('puppeteer');

async function checkMixedContent(url) {
  let browser;
  let mixedContentUrls = [];

  try {
    if (!url.startsWith('https://')) {
      return {
        passed: true, // This check is not relevant for non-HTTPS pages
        score: 1,
        message: 'ℹ️ Page is not HTTPS — mixed content check skipped'
      };
    }

    browser = await puppeteer.launch({ headless: 'new', timeout: 10000 });
    const page = await browser.newPage();

    // Track all network requests
    page.on('request', (req) => {
      const resourceUrl = req.url();
      if (resourceUrl.startsWith('http://')) {
        mixedContentUrls.push(resourceUrl);
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Give time for requests to fire

    if (mixedContentUrls.length > 0) {
      return {
        passed: false,
        score: 0,
        message: `❌ Mixed content found (${mixedContentUrls.length} insecure resources loaded)`
      };
    } else {
      return {
        passed: true,
        score: 1,
        message: '✅ No mixed content detected — all resources are secure'
      };
    }

  } catch (error) {
    return {
      passed: false,
      score: 0,
      message: `❌ Error checking mixed content: ${error.message}`
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkMixedContent;
