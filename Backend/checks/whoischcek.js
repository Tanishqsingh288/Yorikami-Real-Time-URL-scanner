const whois = require('whois-json');
const { parse } = require('tldts');

async function checkWhoisInfo(url) {
  try {
    const parsed = parse(url);
    const domain = parsed.domain;

    if (!domain) {
      return {
        passed: false,
        score: 0,
        message: '❌ Could not extract domain from URL'
      };
    }

    const whoisData = await whois(domain);
    const now = new Date();

    // 1. Check registrar
    if (!whoisData.registrar || /privacy|redacted|whoisguard|withheld/i.test(whoisData.registrar)) {
      return {
        passed: false,
        score: 0,
        message: '❌ WHOIS registrar missing or anonymized'
      };
    }

    // 2. Creation date check
    const creation = new Date(whoisData.creationDate);
    if (!creation || isNaN(creation.getTime())) {
      return {
        passed: false,
        score: 0,
        message: '❌ Invalid or missing creation date in WHOIS'
      };
    }
    const ageInDays = (now - creation) / (1000 * 60 * 60 * 24);
    if (ageInDays < 30) {
      return {
        passed: false,
        score: 0,
        message: `❌ Domain is newly created (${Math.floor(ageInDays)} days old)`
      };
    }

    // 3. Expiry date check
    const expiryRaw = whoisData.registrarRegistrationExpirationDate || whoisData.expirationDate;
    const expiry = new Date(expiryRaw);
    if (!expiry || isNaN(expiry.getTime())) {
      return {
        passed: false,
        score: 0,
        message: '❌ Invalid or missing expiration date in WHOIS'
      };
    }
    const expiresInDays = (expiry - now) / (1000 * 60 * 60 * 24);
    if (expiresInDays < 30) {
      return {
        passed: false,
        score: 0,
        message: `❌ Domain is expiring soon (in ${Math.floor(expiresInDays)} days)`
      };
    }

    // 4. WHOIS info privacy flag
    const redactedFields = Object.values(whoisData).filter(
      (val) =>
        typeof val === 'string' &&
        /redacted|privacy|protected|whoisguard|not disclosed|gdpr/i.test(val)
    );
    if (redactedFields.length > 0) {
      return {
        passed: false,
        score: 0,
        message: '❌ WHOIS data appears to be hidden or anonymized'
      };
    }

    // 5. Name server check
    const nameServers = whoisData.nameServers || [];
    const badNS = (Array.isArray(nameServers) ? nameServers : [nameServers]).filter(ns =>
      /^[a-z0-9]{10,}\./i.test(ns) || /cloudfront|fastly|akamai|netlify|cdn/i.test(ns)
    );
    if (badNS.length > 0) {
      return {
        passed: false,
        score: 0,
        message: '❌ Suspicious or CDN-based name servers detected'
      };
    }

    // ✅ All checks passed
    return {
      passed: true,
      score: 1,
      message: '✅ WHOIS info appears valid and trustworthy'
    };

  } catch (error) {
    return {
      passed: false,
      score: 0,
      message: `❌ WHOIS check failed: ${error.message}`
    };
  }
}

module.exports = checkWhoisInfo;
