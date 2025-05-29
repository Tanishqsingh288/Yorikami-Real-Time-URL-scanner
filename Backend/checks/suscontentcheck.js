const puppeteer = require('puppeteer');

async function checkSuspiciousContent(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    let forcedDownloadDetected = false;
    let autoPopupDetected = false;
    let suspiciousScriptDetected = false;
    let suspiciousNetworkRequests = 0;

    // Track requests for executables or attachments that happen *without user action*
    page.on('response', async response => {
      const headers = response.headers();
      const url = response.url().toLowerCase();

      const contentDisposition = headers['content-disposition'] || '';
      const contentType = headers['content-type'] || '';

      const riskyExtensions = [
  '.exe', '.msi', '.bat', '.apk', '.js', '.jar', '.scr',
  '.ps1', '.vbs', '.cmd', '.sh', '.py', '.pl', '.php',
  '.rb', '.reg', '.wsf', '.jse', '.scf', '.dll', '.lnk',
  '.hta', '.class', '.msh', '.gadget'
];
      const riskyMimeTypes = ['application/x-msdownload', 'application/java-archive', 'application/octet-stream'];

      const isAttachment = contentDisposition.includes('attachment');
      const hasRiskyMime = riskyMimeTypes.some(type => contentType.includes(type));
      const hasRiskyExt = riskyExtensions.some(ext => url.endsWith(ext));

      if ((isAttachment && hasRiskyMime) || hasRiskyExt) {
        forcedDownloadDetected = true;
      }
    });

    // Detect dialogs shown *immediately* on page load (likely annoying popups)
    page.on('dialog', dialog => {
      autoPopupDetected = true;
      dialog.dismiss();
    });

    // After page load, analyze scripts for suspicious behavior
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
   await new Promise(resolve => setTimeout(resolve, 3000)); // short delay to catch auto downloads/dialogs

    const scripts = await page.$$eval('script', scripts =>
      scripts
        .map(s => s.textContent)
        .filter(code => code && code.length > 50)
    );

    for (const code of scripts) {
      if (
        /\beval\s*\(/.test(code) ||
        /Function\s*\(/.test(code) ||
        /atob\s*\(/.test(code) ||
        /document\.write\s*\(/.test(code) // direct DOM injection
      ) {
        suspiciousScriptDetected = true;
        break;
      }
    }

    // Count iframes only from different origins (potentially risky embeds)
    const externalIframeCount = await page.evaluate(() => {
      const frames = Array.from(document.querySelectorAll('iframe'));
      const sameOriginFrames = frames.filter(f => {
        try {
          return f.src.startsWith(window.location.origin);
        } catch {
          return false;
        }
      });
      return frames.length - sameOriginFrames.length;
    });

    // Combine signals - only fail if multiple high confidence flags raised
    const suspiciousFlags = [
      forcedDownloadDetected,
      autoPopupDetected,
      suspiciousScriptDetected,
      externalIframeCount > 2
    ];

    const flagsCount = suspiciousFlags.filter(Boolean).length;

    if (flagsCount >= 2) {
      return { passed: false, score: 0, message: '⚠️ Suspicious content detected based on multiple strong indicators' };
    }

    return { passed: true, score: 1, message: '✅ No suspicious content detected' };

  } catch (error) {
    return { passed: false, score: 0, message: `Error: ${error.message}` };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkSuspiciousContent;
