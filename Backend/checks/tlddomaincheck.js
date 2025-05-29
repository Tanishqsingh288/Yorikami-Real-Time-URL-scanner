const { parse } = require('tldts');

function checkDomainAuthenticity(url) {
  try {
    const parsed = parse(url);

    // 1. Flag if domain is IP address
    if (parsed.isIp) {
      return {
        passed: false,
        score: 0,
        message: '❌ Domain is an IP address — potentially suspicious'
      };
    }

    // 2. Check if valid ICANN domain
    if (!parsed.isIcann || !parsed.domain) {
      return {
        passed: false,
        score: 0,
        message: '❌ Domain is not recognized as a valid ICANN domain'
      };
    }

    // 3. Flag risky TLDs
    const riskyTlds = [
  'xyz', 'top', 'tk', 'gq', 'ml', 'cf', 'ga', 'men', 'loan', 'bid',
  'win', 'party', 'review', 'stream', 'date', 'trade', 'webcam',
  'download', 'racing', 'science', 'biz', 'info', 'pw', 'work',
  'online', 'site', 'space', 'tech', 'fun', 'live', 'click', 'link',
  'pro', 'shop', 'store', 'uno', 'vip', 'world', 'accountant', 'bar',
  'cricket', 'faith', 'gdn', 'kim', 'lol', 'mom', 'ninja', 'porn',
  'sex', 'adult', 'bet', 'casino', 'poker', 'sucks', 'wtf',
  'academy', 'accountants', 'adultfriendfinder', 'agency', 'bargains',
  'bike', 'bingo', 'blackfriday', 'blue', 'boutique', 'builders',
  'buzz', 'cam', 'camera', 'camp', 'capital', 'cards', 'care',
  'cash', 'casino', 'catering', 'center', 'chat', 'cheap', 'christmas',
  'church', 'city', 'claims', 'cleaning', 'clicks', 'clinic', 'clothing',
  'cloud', 'club', 'coach', 'codes', 'coffee', 'college', 'community',
  'company', 'computer', 'construction', 'consulting', 'contractors',
  'cool', 'coupons', 'credit', 'creditcard', 'cricket', 'cruise',
  'dating', 'deals', 'degree', 'delivery', 'democrat', 'dental',
  'diamonds', 'diet', 'digital', 'direct', 'discount', 'doctor',
  'dog', 'domains', 'download', 'earth', 'education', 'email',
  'energy', 'engineer', 'engineering', 'enterprises', 'equipment',
  'estate', 'events', 'exchange', 'expert', 'exposed', 'express',
  'fail', 'faith', 'family', 'fans', 'farm', 'finance', 'financial',
  'fish', 'fishing', 'fitness', 'flights', 'florist', 'flowers',
  'fly', 'foo', 'football', 'forsale', 'foundation', 'free', 'fun',
  'fund', 'furniture', 'futbol', 'gallery', 'game', 'games', 'garden',
  'gift', 'gifts', 'gives', 'glass', 'global', 'gold', 'golf',
  'graphics', 'gratis', 'green', 'gripe', 'group', 'guide', 'guitars',
  'guru', 'health', 'healthcare', 'help', 'hiphop', 'hiv', 'hockey',
  'holdings', 'holiday', 'home', 'homes', 'horse', 'hospital',
  'host', 'hosting', 'house', 'how', 'ice', 'icu', 'immo', 'immobilien',
  'industries', 'institute', 'insurance', 'insure', 'international',
  'investments', 'jewelry', 'joburg', 'juegos', 'kaufen', 'kim',
  'kitchen', 'kiwi', 'land', 'lawyer', 'lease', 'legal', 'lgbt',
  'life', 'lighting', 'limited', 'limo', 'link', 'live', 'loan',
  'loans', 'ltd', 'luxe', 'luxury', 'management', 'market', 'marketing',
  'mba', 'media', 'meet', 'meme', 'memorial', 'men', 'menu', 'miami',
  'moda', 'money', 'mortgage', 'movie', 'museum', 'music', 'mutual',
  'navy', 'network', 'news', 'ninja', 'one', 'online', 'ooo', 'organic',
  'partners', 'parts', 'party', 'pet', 'pharmacy', 'photography',
  'photos', 'physio', 'pics', 'pictures', 'pizza', 'place', 'plumbing',
  'plus', 'poker', 'porn', 'press', 'prime', 'promo', 'properties',
  'property', 'protection', 'pub', 'qpon', 'racing', 'recipes',
  'red', 'rehab', 'reise', 'reisen', 'rent', 'repair', 'report',
  'republican', 'rest', 'restaurant', 'review', 'reviews', 'rich',
  'rip', 'rocks', 'rodeo', 'room', 'run', 'ryukyu', 'safe', 'sale',
  'salon', 'sarl', 'school', 'science', 'security', 'services',
  'sex', 'sexy', 'shoes', 'shopping', 'show', 'shriram', 'singles',
  'site', 'ski', 'skin', 'sky', 'sms', 'soccer', 'social', 'software',
  'solar', 'solutions', 'space', 'sports', 'store', 'stream', 'studio',
  'study', 'style', 'sucks', 'supplies', 'supply', 'support', 'surf',
  'surgery', 'systems', 'tax', 'taxi', 'team', 'tech', 'technology',
  'tel', 'theater', 'tickets', 'tips', 'tires', 'today', 'tools',
  'top', 'tours', 'town', 'toys', 'trade', 'trading', 'training',
  'travel', 'trust', 'tube', 'tv', 'university', 'vacations', 'vegas',
  'ventures', 'vet', 'video', 'villas', 'vin', 'vip', 'vision', 'vlaanderen',
  'vodka', 'vote', 'voting', 'voyage', 'watch', 'webcam', 'website',
  'wed', 'wedding', 'wiki', 'win', 'wine', 'work', 'works', 'world',
  'wow', 'wtf', 'xxx', 'xyz', 'zone'
];


    if (riskyTlds.includes(parsed.publicSuffix)) {
      return {
        passed: false,
        score: 0,
        message: `❌ Suspicious domain extension detected: .${parsed.publicSuffix}`
      };
    }

    // 4. Whitelist of trusted domains (exact match)
    const knownSafeDomains = [
  "apple.com", "netflix.com", "tesla.com", "ibm.com", "oracle.com",
  "intel.com", "nvidia.com", "adobe.com", "salesforce.com", "cisco.com",
  "twitter.com", "linkedin.com", "instagram.com", "tiktok.com", "snapchat.com",
  "pinterest.com", "reddit.com", "discord.com", "telegram.org", "whatsapp.com",
  "ebay.com", "alibaba.com", "shopify.com", "walmart.com", "target.com",
  "bestbuy.com", "etsy.com", "aliexpress.com", "jd.com", "zalando.com",
  "vmware.com", "sap.com", "servicenow.com", "workday.com", "twilio.com",
  "atlassian.com", "github.com", "gitlab.com", "digitalocean.com", "dropbox.com",
  "youtube.com", "spotify.com", "disneyplus.com", "hulu.com", "hbomax.com",
  "twitch.tv", "soundcloud.com", "deezer.com", "peacocktv.com", "vimeo.com",
  "flipkart.com", "amazon.in", "paytm.com", "ola.com", "uber.com",
  "makemytrip.com", "goibibo.com", "redbus.in", "irctc.co.in", "swiggy.com",
  "zomato.com", "bookmyshow.com", "nykaa.com", "myntra.com", "ajio.com",
  "snapdeal.com", "jabong.com", "dominos.co.in", "foodpanda.in", "bigbasket.com",
  "grofers.com", "pharmeasy.in", "1mg.com", "practo.com", "medlife.com",
  "timesofindia.indiatimes.com", "ndtv.com", "hindustantimes.com", "thehindu.com", "indianexpress.com",
  "zeenews.india.com", "news18.com", "bbc.com/news/india", "economictimes.indiatimes.com", "livemint.com",
  "cricbuzz.com", "espncricinfo.com", "hotstar.com", "sonyLIV.com", "voot.com",
  "zee5.com", "altbalaji.com", "mxplayer.in", "jio.com", "airtel.in",
  "bsnl.co.in", "gov.in", "uidai.gov.in", "mca.gov.in", "income taxindia.gov.in",
  "irctc.co.in", "passportindia.gov.in", "aajtak.in", "abplive.com", "indiatoday.in",
  "quora.com", "stackexchange.com", "hackerrank.com", "coursera.org", "unacademy.com",
  "byjus.com", "vedantu.com", "toppr.com", "internshala.com", "angel.co",
  "timesjobs.com", "naukri.com", "shine.com", "monsterindia.com", "linkedin.com/jobs",
  "google.co.in", "gmail.com", "drive.google.com", "docs.google.com", "meet.google.com",
  "zoom.us", "teams.microsoft.com", "slack.com", "asana.com", "trello.com",
  "medium.com", "dev.to", "stackoverflow.com", "github.com", "gitlab.com"
];


    if (knownSafeDomains.includes(parsed.domain)) {
      return {
        passed: true,
        score: 1,
        message: '✅ Trusted domain detected'
      };
    }

    // 5. If no issues found, pass as valid
    return {
      passed: true,
      score: 1,
      message: `✅ Domain appears valid: ${parsed.domain}`
    };

  } catch (error) {
    console.error('Domain check error:', error.message || error);
    return {
      passed: false,
      score: 0,
      message: 'Failed to analyze domain structure'
    };
  }
}

module.exports = checkDomainAuthenticity;
