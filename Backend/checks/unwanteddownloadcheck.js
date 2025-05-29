const puppeteer = require('puppeteer');

async function checkUnwantedDownloads(url) {
  let browser;
  let forcedDownloadDetected = false;

  // Suspicious extensions AND binary MIME types
  const riskyExtensions = [
    '.exe', '.msi', '.bat', '.cmd', '.apk', '.scr', '.vbs', '.jar', '.zip', '.rar',
    // ... keep your full list
  ];

  const riskyMimeTypes = [
    'application/octet-stream',
    'application/x-msdownload',
    'application/x-ms-installer',
    // ... keep your full list
  ];

  try {
    browser = await puppeteer.launch({ headless: 'new', timeout: 10000 });
    const page = await browser.newPage();

    // Record the timestamp when page starts loading
    const navigationStart = Date.now();

    page.on('response', async (response) => {
      try {
        // Only consider responses received within 5 seconds of navigation start (to avoid user-click triggered downloads)
        if (Date.now() - navigationStart > 5000) return;

        const headers = response.headers();
        const resUrl = response.url();
        const contentType = headers['content-type'] || '';
        const contentDisposition = headers['content-disposition'] || '';

        const isAttachment = contentDisposition.toLowerCase().includes('attachment');
        const isBinary = riskyMimeTypes.some(type => contentType.toLowerCase().includes(type));
        const isExecutableLink = riskyExtensions.some(ext => resUrl.toLowerCase().includes(ext));

        // Flag unwanted download only if it occurs automatically within the first 5 seconds
        if ((isAttachment && isBinary) || isExecutableLink) {
          forcedDownloadDetected = true;
        }
      } catch (err) {
        // Ignore parsing issues silently
      }
    });

    // Go to page, wait for DOM content loaded and some extra delay for downloads to start
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); // wait for possible auto-downloads

    if (forcedDownloadDetected) {
      return {
        passed: false,
        score: 0,
        message: '⚠️ Unwanted automatic download detected on this website'
      };
    } else {
      return {
        passed: true,
        score: 1,
        message: '✅ No unwanted automatic downloads found'
      };
    }

  } catch (error) {
    return {
      passed: false,
      score: 0,
      message: `Error checking for unwanted downloads: ${error.message}`
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkUnwantedDownloads;
