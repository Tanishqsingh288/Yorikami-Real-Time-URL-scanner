const { https, http } = require('follow-redirects');

/**
 * Checks if URL redirects by comparing initial and final URLs.
 * Score = 0 if redirected, else 1.
 * Returns final URL after following redirects.
 *
 * @param {string} url - Initial URL to check
 * @returns {Promise<Object>} - { passed, score, message, finalUrl }
 */
function checkRedirects(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;

      const options = {
        maxRedirects: 10,
        timeout: 5000,
      };

      const req = client.get(url, options, (res) => {
        const finalUrl = res.responseUrl || url;

        if (finalUrl !== url) {
          // Redirect happened
          resolve({
            passed: false,
            score: 0,
            message: `⚠️ URL redirected from ${url} to ${finalUrl}`,
            finalUrl
          });
        } else {
          // No redirect
          resolve({
            passed: true,
            score: 1,
            message: '✅ No redirects detected',
            finalUrl
          });
        }
      });

      req.on('error', (err) => {
        resolve({
          passed: false,
          score: 0,
          message: `Redirect check failed: ${err.message}`
        });
      });

      req.setTimeout(5000, () => {
        req.abort();
        resolve({
          passed: false,
          score: 0,
          message: 'Redirect check timed out'
        });
      });

    } catch (error) {
      resolve({
        passed: false,
        score: 0,
        message: `Redirect check error: ${error.message}`
      });
    }
  });
}

module.exports = checkRedirects;
