function checkHttps(url) {
  const passed = url.startsWith('https://');
  return {
    passed,
    score: passed ? 1 : 0,
    message: passed ? '✅ HTTPS is enabled' : 'HTTPS is not enabled'
  };
}

module.exports = checkHttps;
