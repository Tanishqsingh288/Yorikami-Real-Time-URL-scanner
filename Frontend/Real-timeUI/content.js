(async function () {
  console.log("✅ Yorikami Realtime Scanner is running");
  const startTime = performance.now();

  // Extract links efficiently
  const allLinks = Array.from(document.querySelectorAll("a"))
    .map(a => ({
      url: a.href.trim(),
      title: a.innerText.trim() || a.href.trim()
    }))
    .filter(link => link.url.startsWith("http"));

  // Remove duplicates
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

  // Create UI
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

  // Update timer during scan
  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime)/1000).toFixed(2);
    timeDisplay.textContent = `⏱️ ${elapsed}s elapsed`;
  }, 100);

  const unsafeUrls = [];
  const cache = new Map();

  // Process in parallel without artificial delays
  await Promise.allSettled(uniqueLinks.map(async ({ url, title }) => {
    if (url.startsWith("http://")) {
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure: ${title}</span>`;
      resultList.appendChild(li);
      unsafeUrls.push({ url, title });
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
        unsafeUrls.push({ url, title });
      } else {
        cache.set(url, "safe");
      }
    } catch (err) {
      console.error(`❌ Failed to check ${url}`, err);
    }
  }));

  // Stop timer and show final time
  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime)/1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  if (unsafeUrls.length === 0) {
    resultList.innerHTML = `<li style="color:lightgreen;">✅ No unsafe or insecure URLs found</li>`;
  } else {
    analyseBtn.style.display = "inline-block";
  }

  // Deep Analyse handler
  analyseBtn.addEventListener("click", async () => {
    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Analysing...";

    for (const item of unsafeUrls) {
      try {
        const res = await fetch("https://yorikamiscanner.duckdns.org/api/check/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.url })
        });

        if (res.ok) {
          console.log(`✅ Analysed: ${item.title}`);
        } else {
          console.warn(`⚠️ Failed to analyse ${item.url}`);
        }
      } catch (err) {
        console.error(`❌ Error analysing ${item.url}`, err);
      }
    }

    analyseStatus.innerText = "✅ Deep analysis complete!";
  });
})();