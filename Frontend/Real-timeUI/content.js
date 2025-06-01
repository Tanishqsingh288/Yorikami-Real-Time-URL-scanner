(async function () {
  console.log("✅ Yorikami Realtime Scanner is running");
  const startTime = performance.now();

  // Extract unique HTTP/HTTPS links
  const allLinks = Array.from(document.querySelectorAll("a"))
    .map(a => ({
      url: a.href.trim(),
      title: a.innerText.trim() || a.href.trim()
    }))
    .filter(link => link.url.startsWith("http"));

  const seen = new Set();
  const uniqueLinks = [];
  for (const link of allLinks) {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      uniqueLinks.push(link);
    }
  }

  if (uniqueLinks.length === 0) {
    console.warn("❌ No valid links found.");
    return;
  }

  console.log(`🔍 Found ${uniqueLinks.length} unique URLs`);

  // Create floating popup
  const popup = document.createElement('div');
  popup.id = "webguardx-popup";
  popup.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: #222; color: #fff; padding: 15px;
    border-radius: 10px; z-index: 999999;
    max-height: 300px; overflow-y: auto;
    font-size: 14px; font-family: Arial, sans-serif;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    width: 300px;
  `;
  popup.innerHTML = `
    <b>🔒 Yorikami Scan:</b><br>
    Scanning ${uniqueLinks.length} links...
    <div id="scan-time" style="font-size:12px;margin-top:5px;"></div>
    <ul id="result-list" style="padding-left: 20px; margin-top: 10px;"></ul>
    <button id="analyse-btn" style="margin-top: 10px; display:none; background:#00c9a7; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer;">Deep Analyse</button>
    <div id="analyse-status" style="margin-top: 5px; font-size: 12px;"></div>
  `;
  document.body.appendChild(popup);

  const resultList = document.getElementById('result-list');
  const analyseBtn = document.getElementById('analyse-btn');
  const analyseStatus = document.getElementById('analyse-status');
  const timeDisplay = document.getElementById('scan-time');

  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    timeDisplay.textContent = `⏱️ ${elapsed}s elapsed`;
  }, 100);

  const unsafeUrls = [];
  const cache = new Map();

  await Promise.allSettled(uniqueLinks.map(async ({ url, title }) => {
    if (url.startsWith("http://")) {
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure: ${title}</span>`;
      resultList.appendChild(li);
      unsafeUrls.push(url); // Just URL string
      return;
    }

    if (cache.has(url)) return;

    try {
      const res = await fetch("https://yorikamiscanner.duckdns.org/api/links/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url] })
      });

      const data = await res.json();
      if (data.unsafeUrls && data.unsafeUrls.includes(url)) {
        const li = document.createElement('li');
        li.innerHTML = `<span style="color: #ff4e4e;">🚨 Unsafe: ${title}</span>`;
        resultList.appendChild(li);
        unsafeUrls.push(url); // Just URL string
      } else {
        cache.set(url, "safe");
      }
    } catch (err) {
      console.error(`❌ Failed to check ${url}`, err);
    }
  }));

  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  if (unsafeUrls.length === 0) {
    resultList.innerHTML = `<li style="color:lightgreen;">✅ No unsafe or insecure URLs found</li>`;
  } else {
    analyseBtn.style.display = "inline-block";
  }

  // ✅ Deep Analyse Button Click
  analyseBtn.addEventListener("click", async () => {
    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Preparing Deep Analysis...";

    chrome.storage.local.get(["token", "sessionId"], async (result) => {
      const { token, sessionId } = result;

      if (!token || !sessionId) {
        analyseStatus.innerText = "Redirecting to login...";
        setTimeout(() => {
          window.location.href = chrome.runtime.getURL('webpages/auth.html');
        }, 1500);
        return;
      }

      try {
        // ✅ Save only string URLs
        await new Promise((resolve) => {
          chrome.storage.local.set({ deepUrls: unsafeUrls }, resolve);
        });

        analyseStatus.innerText = "🔁 Redirecting to dashboard...";
        setTimeout(() => {
          window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
        }, 1000);
      } catch (err) {
        console.error("❌ Failed to prepare analysis:", err);
        analyseStatus.innerText = "❌ Failed to store data for analysis.";
      }
    });
  });
})();
