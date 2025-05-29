const sslChecker = require('ssl-checker');

async function checkSSL(url) {
  try {
    const domain = new URL(url).hostname;
    const data = await sslChecker(domain, { method: 'GET', port: 443 });
    const valid = data.valid;
    const message = valid
      ? `✅ SSL certificate is valid until ${data.validTo}`
      : `SSL certificate is invalid or expired`;

    return {
      passed: valid,
      score: valid ? 1 : 0,
      message
    };
  } catch (error) {
    return {
      passed: false,
      score: 0,
      message: 'Failed to verify SSL certificate'
    };
  }
}

module.exports = checkSSL;