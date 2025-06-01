(async function () {
  console.log("✅ Yorikami Realtime Scanner is running");
  const startTime = performance.now();

  // STEP 1: Extract all valid HTTP(S) links
  const uniqueLinks = Array.from(
    new Set(
      [...document.querySelectorAll("a")]
        .map(a => a.href.trim())
        .filter(href => href.startsWith("http"))
    )
  ).map(url => ({
    url,
    title: (document.querySelector(`a[href="${url}"]`)?.innerText || url).trim()
  }));

  if (uniqueLinks.length === 0) {
    console.warn("❌ No valid links found.");
    return;
  }

  console.log(`🔍 Found ${uniqueLinks.length} unique URLs`);

  // STEP 2: Create floating popup UI
  const popup = document.createElement('div');
  popup.id = "yorikami-popup";
  popup.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: #1c1c1e; color: #fff; padding: 15px;
    border-radius: 10px; z-index: 999999;
    max-height: 320px; overflow-y: auto;
    font-size: 14px; font-family: 'Segoe UI', sans-serif;
    box-shadow: 0 0 15px rgba(0,0,0,0.7);
    width: 320px;
  `;
  popup.innerHTML = `
    <strong>🔒 Yorikami Scan:</strong><br>
    <span id="scan-status">Scanning ${uniqueLinks.length} links...</span>
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
  const scanStatus = document.getElementById('scan-status');

  // STEP 3: Timer display
  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    timeDisplay.textContent = `⏱️ ${elapsed}s elapsed`;
  }, 100);

  const unsafeUrls = [];

  // STEP 4: Parallel scanning of links
  await Promise.allSettled(uniqueLinks.map(async ({ url, title }) => {
    const li = document.createElement('li');

    if (url.startsWith("http://")) {
      li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure: ${title}</span>`;
      unsafeUrls.push({ url, title });
    } else {
      try {
        const res = await fetch("https://yorikamiscanner.duckdns.org/api/links/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [url] })
        });

        const data = await res.json();
        if (data.unsafeUrls?.includes(url)) {
          li.innerHTML = `<span style="color: #ff4e4e;">🚨 Unsafe: ${title}</span>`;
          unsafeUrls.push({ url, title });
        } else {
          li.innerHTML = `<span style="color: #5eff7e;">✅ Safe: ${title}</span>`;
        }
      } catch (err) {
        li.innerHTML = `<span style="color: #ffaa00;">⚠️ Error: ${title}</span>`;
        console.error(`❌ Error checking ${url}`, err);
      }
    }

    resultList.appendChild(li);
  }));

  // STEP 5: Finish scan
  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  if (unsafeUrls.length === 0) {
    scanStatus.innerHTML = `<span style="color:lightgreen;">✅ All links are secure</span>`;
  } else {
    scanStatus.innerHTML = `<span style="color:#ff6666;">⚠️ ${unsafeUrls.length} suspicious links detected</span>`;
    analyseBtn.style.display = "inline-block";
  }

  // STEP 6: Deep Analyse handler
  analyseBtn.addEventListener("click", async () => {
    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Analysing suspicious links...";

    for (const item of unsafeUrls) {
      try {
        const res = await fetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.url })
        });

        if (res.status === 401) {
          analyseStatus.innerText = "🔐 Redirecting for auth...";
          setTimeout(() => {
            window.location.href = chrome.runtime.getURL('webpages/auth.html');
          }, 1500);
          return;
        }

        if (!res.ok) {
          console.warn(`⚠️ Analysis failed for ${item.url}`);
        } else {
          console.log(`✅ Analysed: ${item.title}`);
        }
      } catch (err) {
        console.error(`❌ Deep analysis error for ${item.url}`, err);
      }
    }

    analyseStatus.innerText = "✅ Deep analysis complete!";
  });

})();
