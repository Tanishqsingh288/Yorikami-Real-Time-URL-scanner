(async function () {
  console.log("✅ Yorikami Realtime Scanner is running");
  const startTime = performance.now();

  chrome.storage.local.set({ storageTest: "test" }, () => {
    if (chrome.runtime.lastError) {
      console.error("❌ Initial storage test failed:", chrome.runtime.lastError);
    }
  });

  // Function to display server error message
  function showServerError() {
    const existingError = document.getElementById('server-error-message');
    if (existingError) return;

    const errorDiv = document.createElement('div');
    errorDiv.id = 'server-error-message';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.backgroundColor = '#ffebee';
    errorDiv.style.color = '#c62828';
    errorDiv.style.padding = '15px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.border = '1px solid #ef9a9a';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.maxWidth = '300px';
    errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    errorDiv.textContent = '⚠️ Server is down. Please try again later.';

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  const allLinks = Array.from(document.querySelectorAll("a"))
    .map(a => {
      const rawHref = (a.getAttribute("href") || "").trim();
      return {
        rawHref,
        url: a.href.trim(),
        title: a.innerText.trim() || a.href.trim()
      };
    })
    .filter(link => link.rawHref.startsWith("http") || link.rawHref.startsWith("//"));

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
    Scanning ${uniqueLinks.length} URLs...
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
  let serverErrorOccurred = false;

  await Promise.allSettled(uniqueLinks.map(async ({ rawHref, url, title }) => {
    if (rawHref.startsWith("http://")) {
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure: ${title}</span>`;
      resultList.appendChild(li);
      unsafeUrls.push({ url, title });
      chrome.storage.local.set({ deepUrls: unsafeUrls }, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError);
        }
      });
      return;
    }

    if (rawHref.startsWith("//") && window.location.protocol === "http:") {
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure Protocol-Relative: ${title}</span>`;
      resultList.appendChild(li);
      unsafeUrls.push({ url, title });
      chrome.storage.local.set({ deepUrls: unsafeUrls }, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError);
        }
      });
      return;
    }

    if (cache.has(url)) return;

    try {
      const res = await fetch("https://yorikamiscanner.duckdns.org/api/links/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url] }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.unsafeUrls && data.unsafeUrls.includes(url)) {
        const li = document.createElement('li');
        li.innerHTML = `<span style="color: #ff4e4e;">🚨 Unsafe: ${title}</span>`;
        resultList.appendChild(li);
        unsafeUrls.push({ url, title });
        chrome.storage.local.set({ deepUrls: unsafeUrls }, () => {
          if (chrome.runtime.lastError) {
            console.error("Storage error:", chrome.runtime.lastError);
          }
        });
      } else {
        cache.set(url, "safe");
      }
    } catch (err) {
      console.error(`❌ Failed to check ${url}`, err);
      if (!serverErrorOccurred && (err.message.includes('Failed to fetch') || 
          err.message.includes('NetworkError') || 
          err.name === 'AbortError')) {
        serverErrorOccurred = true;
        showServerError();
      }
    }
  }));

  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  // Append [X] button after scan is completed
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style = `
    position: absolute;
    top: 5px;
    right: 10px;
    color: #aaa;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  `;
  closeBtn.addEventListener("click", () => popup.remove());
  popup.appendChild(closeBtn);

  if (unsafeUrls.length === 0 && !serverErrorOccurred) {
    resultList.innerHTML = `<li style="color:lightgreen;">✅ No unsafe or insecure URLs found</li>`;
  } else if (serverErrorOccurred) {
    resultList.innerHTML += `<li style="color:#ff884d;">⚠️ Some URLs couldn't be checked (server issue)</li>`;
  } else {
    analyseBtn.style.display = "inline-block";
    chrome.storage.local.set({ deepUrls: unsafeUrls }, () => {
      if (chrome.runtime.lastError) {
        console.error("Final storage error:", chrome.runtime.lastError);
      }
    });
  }

  analyseBtn.addEventListener("click", async () => {
    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Preparing Deep Analysis...";

    chrome.storage.local.get(["token", "sessionId"], (result) => {
      const token = result.token;
      const sessionId = result.sessionId;

      if (!token || !sessionId) {
        analyseStatus.innerText = "Redirecting to login...";
        setTimeout(() => {
          window.location.href = chrome.runtime.getURL('webpages/auth.html');
        }, 1500);
        return;
      }

      chrome.storage.local.get("deepUrls", (storageResult) => {
        if (!storageResult.deepUrls || storageResult.deepUrls.length === 0) {
          chrome.storage.local.set({ deepUrls: unsafeUrls }, () => {
            if (chrome.runtime.lastError) {
              console.error("❌ Storage error:", chrome.runtime.lastError);
              analyseStatus.innerText = "❌ Could not save scan data.";
              return;
            }
            proceedWithRedirect();
          });
        } else {
          proceedWithRedirect();
        }
      });

      function proceedWithRedirect() {
        analyseStatus.innerText = "🔁 Redirecting to dashboard...";
        window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
      }
    });
  });
})();