const BASE_API_URL = "https://yorikamiscanner.duckdns.org";

(async function () {
  const startTime = performance.now();

  try {
    await chrome.storage.local.set({ storageTest: "test" });
  } catch {}

  function showServerError() {
    if (document.getElementById("server-error-message")) return;

    const errorDiv = document.createElement("div");
    errorDiv.id = "server-error-message";
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #ffebee;
      color: #c62828;
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #ef9a9a;
      z-index: 999999;
      max-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    errorDiv.textContent = "⚠️ Yorikami Server is Down. Please try again later.";
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  function checkHttpRedirect(url) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "CHECK_HTTP_REDIRECT", url },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const allLinks = Array.from(document.querySelectorAll("a"))
    .map((a) => {
      const rawHref = (a.getAttribute("href") || "").trim();
      return {
        rawHref,
        url: a.href.trim(),
        title: (a.innerText || a.getAttribute("title") || a.href).trim().substring(0, 50),
      };
    })
    .filter((link) =>
      (link.rawHref.startsWith("http") || link.rawHref.startsWith("//")) && isValidUrl(link.url)
    );

  const seen = new Set();
  const uniqueLinks = allLinks.filter((link) => {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      return true;
    }
    return false;
  });

  if (uniqueLinks.length === 0) return;

  const popup = document.createElement("div");
  popup.id = "webguardx-popup";
  popup.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #222;
    color: #fff;
    padding: 15px;
    border-radius: 10px;
    z-index: 999999;
    max-height: 300px;
    overflow-y: auto;
    font-size: 14px;
    font-family: Arial, sans-serif;
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

  const resultList = document.getElementById("result-list");
  const analyseBtn = document.getElementById("analyse-btn");
  const analyseStatus = document.getElementById("analyse-status");
  const timeDisplay = document.getElementById("scan-time");

  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    timeDisplay.textContent = `⏱️ ${elapsed}s elapsed`;
  }, 100);

  const unsafeUrls = [];
  const cache = new Map();
  let serverErrorOccurred = false;

  try {
    await Promise.allSettled(
      uniqueLinks.map(async ({ rawHref, url, title }) => {
        if (rawHref.startsWith("http://")) {
          try {
            const response = await checkHttpRedirect(url);
            if (response?.redirectsToHttps === false) {
              const li = document.createElement("li");
              li.innerHTML = `🚨 <strong style="color: red;"></strong> <span style="color: #ffcc00; font-weight: bold;">${title}</span>`;
              resultList.appendChild(li);
              unsafeUrls.push({ url, title });
              highlightUnsafeLink(url);
            } else {
              cache.set(url, "safe");
            }
          } catch {
            const li = document.createElement("li");
            li.innerHTML = `⚠️ <strong style="color: orange;">Unverified:</strong> <span style="color: #ffcc00; font-weight: bold;">${title}</span>`;
            resultList.appendChild(li);
            unsafeUrls.push({ url, title });
            highlightUnsafeLink(url);
          }
          return;
        }

        unsafeUrls.forEach(({ url }) => highlightUnsafeLink(url));

        if (rawHref.startsWith("//") && window.location.protocol === "http:") {
          const li = document.createElement("li");
          li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure Protocol-Relative: ${title}</span>`;
          resultList.appendChild(li);
          unsafeUrls.push({ url, title });
          return;
        }

        if (cache.has(url)) return;

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(`${BASE_API_URL}/api/links/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: [url] }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

          const data = await res.json();
          if (data.unsafeUrls && data.unsafeUrls.includes(url)) {
            const li = document.createElement("li");
            li.innerHTML = `🚨 <strong style="color: red;">Insecure:</strong> <span style="color: #ffcc00; font-weight: bold;">${title}</span>`;
            resultList.appendChild(li);
            unsafeUrls.push({ url, title });
          } else {
            cache.set(url, "safe");
          }
        } catch (err) {
          const msg = err.message || "";
          const serverDownErrors = ["net::ERR_FAILED"];
          const isServerDownError = serverDownErrors.some((errStr) => msg.includes(errStr));
          if (!serverErrorOccurred && isServerDownError) {
            serverErrorOccurred = true;
            showServerError();
            return;
          }
        }
      })
    );
  } catch {}

  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style.cssText = `
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

  try {
    await chrome.storage.local.set({ deepUrls: unsafeUrls });
  } catch {}

  if (unsafeUrls.length === 0 && !serverErrorOccurred) {
    resultList.innerHTML = `<li style="color:lightgreen;">✅ No unsafe or insecure URLs found</li>`;
    analyseBtn.style.display = "none";

    const goToDashBtn = document.createElement("button");
    goToDashBtn.textContent = "Go to Dashboard";
    goToDashBtn.style.cssText = `
      margin-top: 10px;
      background: #008CBA;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    popup.appendChild(goToDashBtn);

    goToDashBtn.addEventListener("click", async () => {
      goToDashBtn.disabled = true;
      try {
        const { token, sessionId } = await chrome.storage.local.get(["token", "sessionId"]);
        const nextPage = token && sessionId ? "dashboard.html" : "auth.html";
        window.location.href = chrome.runtime.getURL(`webpages/${nextPage}`);
      } catch {
        goToDashBtn.disabled = false;
      }
    });
  } else {
    analyseBtn.style.display = "inline-block";
  }

  analyseBtn?.addEventListener("click", async () => {
    if (!analyseBtn) return;

    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Preparing Deep Analysis...";

    try {
      const { token, sessionId } = await chrome.storage.local.get(["token", "sessionId"]);
      if (!token || !sessionId) {
        analyseStatus.innerText = "Redirecting to login...";
        setTimeout(() => {
          window.location.href = chrome.runtime.getURL("webpages/auth.html");
        }, 1500);
        return;
      }

      const { deepUrls } = await chrome.storage.local.get("deepUrls");
      if (!deepUrls || deepUrls.length === 0) {
        await chrome.storage.local.set({ deepUrls: unsafeUrls });
      }

      analyseStatus.innerText = "🔁 Redirecting to dashboard...";
      window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
    } catch (error) {
      analyseStatus.innerText = "❌ Error: " + error.message;
      analyseBtn.disabled = false;
    }
  });
})();