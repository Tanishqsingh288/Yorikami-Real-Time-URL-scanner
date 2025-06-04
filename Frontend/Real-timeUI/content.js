(async function () {
  console.log("✅ Yorikami Realtime Scanner is running");
  const startTime = performance.now();

  // Test storage access
  try {
    await chrome.storage.local.set({ storageTest: "test" });
    console.log("✔ Storage test successful");
  } catch (error) {
    console.error("❌ Initial storage test failed:", error);
  }

  // Function to display server error message
  function showServerError() {
    const existingError = document.getElementById("server-error-message");
    if (existingError) return;

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
    errorDiv.textContent = "⚠️ Server is down. Please try again later.";

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Function to validate URLs
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Collect all links from the page
  const allLinks = Array.from(document.querySelectorAll("a"))
    .map((a) => {
      const rawHref = (a.getAttribute("href") || "").trim();
      return {
        rawHref,
        url: a.href.trim(),
        title: (a.innerText || a.getAttribute("title") || a.href)
          .trim()
          .substring(0, 50),
      };
    })
    .filter(
      (link) =>
        (link.rawHref.startsWith("http") || link.rawHref.startsWith("//")) &&
        isValidUrl(link.url)
    );

  // Remove duplicates
  const seen = new Set();
  const uniqueLinks = allLinks.filter((link) => {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      return true;
    }
    return false;
  });

  if (uniqueLinks.length === 0) {
    console.warn("❌ No valid links found.");
    return;
  }

  console.log(`🔍 Found ${uniqueLinks.length} unique URLs`);

  // Create popup UI
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

  // Update timer
  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    timeDisplay.textContent = `⏱️ ${elapsed}s elapsed`;
  }, 100);

  // Scan URLs
  const unsafeUrls = [];
  const cache = new Map();
  let serverErrorOccurred = false;

  try {
    await Promise.allSettled(
      uniqueLinks.map(async ({ rawHref, url, title }) => {
        // Check for insecure HTTP URLs
        if (rawHref.startsWith("http://")) {
          const li = document.createElement("li");
          li.innerHTML = `<span style="color: #ffcc00; font-weight: bold;">${title}</span>`;
          resultList.appendChild(li);
          unsafeUrls.push({ url, title });
          return;
        }
        unsafeUrls.forEach(({ url }) => {
          highlightUnsafeLink(url);
        });

        // Check for protocol-relative URLs on HTTP pages
        if (rawHref.startsWith("//") && window.location.protocol === "http:") {
          const li = document.createElement("li");
          li.innerHTML = `<span style="color: #ff884d;">⚠️ Insecure Protocol-Relative: ${title}</span>`;
          resultList.appendChild(li);
          unsafeUrls.push({ url, title });
          return;
        }

        // Skip already checked URLs
        if (cache.has(url)) return;

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(
            "https://yorikamiscanner.duckdns.org/api/links/check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ urls: [url] }),
              signal: controller.signal,
            }
          );

          clearTimeout(timeout);

          if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
          }

          const data = await res.json();
          if (data.unsafeUrls && data.unsafeUrls.includes(url)) {
            const li = document.createElement("li");

            // Wrap only the title part in bright yellow color (fixed)
            li.innerHTML = `
    🚨 <strong style="color: red;">Insecure:</strong> 
    <span style="color: #ffcc00; font-weight: bold;">${title}</span>
  `;

            resultList.appendChild(li);
            unsafeUrls.push({ url, title });
          } else {
            cache.set(url, "safe");
          }
        } catch (err) {
          console.error(`❌ Failed to check ${url}`, err);
          if (
            !serverErrorOccurred &&
            (err.message.includes("Failed to fetch") ||
              err.message.includes("NetworkError") ||
              err.name === "AbortError")
          ) {
            serverErrorOccurred = true;
            showServerError();
          }
        }
      })
    );
  } catch (error) {
    console.error("Error during URL scanning:", error);
  }

  // Clean up and show results
  clearInterval(timerInterval);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  timeDisplay.textContent = `✅ Scan completed in ${totalTime}s`;

  // Add close button
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

  // Save results to storage
  try {
    await chrome.storage.local.set({ deepUrls: unsafeUrls });
    console.log("✔ Saved unsafe URLs to storage");
  } catch (error) {
    console.error("❌ Failed to save unsafe URLs:", error);
  }

  // Update UI based on results
  if (unsafeUrls.length === 0 && !serverErrorOccurred) {
    resultList.innerHTML = `<li style="color:lightgreen;">✅ No unsafe or insecure URLs found</li>`;
  } else {
    analyseBtn.style.display = "inline-block";
    // Add "Go to Dashboard" button
    const dashboardBtn = document.createElement("button");
    dashboardBtn.textContent = "Go to Dashboard";
    dashboardBtn.style.cssText = `
  margin-top: 10px;
  margin-left: 10px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

    // If analyse button is shown, insert beside it
    if (analyseBtn.style.display === "inline-block") {
      analyseBtn.parentNode.insertBefore(dashboardBtn, analyseBtn.nextSibling);
    } else {
      // If not, show the dashboard button alone
      resultList.insertAdjacentElement("afterend", dashboardBtn);
    }

    // Handle dashboard redirection
    dashboardBtn.addEventListener("click", async () => {
      try {
        const { token, sessionId } = await chrome.storage.local.get([
          "token",
          "sessionId",
        ]);

        if (!token || !sessionId) {
          analyseStatus.innerText = "Redirecting to login...";
          setTimeout(() => {
            window.location.href = chrome.runtime.getURL("webpages/auth.html");
          }, 1500);
          return;
        }

        window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
      } catch (error) {
        console.error("❌ Failed to navigate to dashboard:", error);
        analyseStatus.innerText = "❌ Error: " + error.message;
      }
    });
  }

  // Handle deep analysis button click
  analyseBtn?.addEventListener("click", async () => {
    if (!analyseBtn) return;

    analyseBtn.disabled = true;
    analyseStatus.innerText = "⏳ Preparing Deep Analysis...";

    try {
      const { token, sessionId } = await chrome.storage.local.get([
        "token",
        "sessionId",
      ]);

      if (!token || !sessionId) {
        analyseStatus.innerText = "Redirecting to login...";
        setTimeout(() => {
          window.location.href = chrome.runtime.getURL("webpages/auth.html");
        }, 1500);
        return;
      }

      // Ensure we have the latest unsafe URLs
      const { deepUrls } = await chrome.storage.local.get("deepUrls");
      if (!deepUrls || deepUrls.length === 0) {
        await chrome.storage.local.set({ deepUrls: unsafeUrls });
      }

      analyseStatus.innerText = "🔁 Redirecting to dashboard...";
      window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
    } catch (error) {
      console.error("Error during deep analysis setup:", error);
      analyseStatus.innerText = "❌ Error: " + error.message;
      analyseBtn.disabled = false;
    }
  });
})();
function highlightUnsafeLink(unsafeUrl) {
  const anchors = document.querySelectorAll("a");

  anchors.forEach((anchor) => {
    if (anchor.href.trim() === unsafeUrl.trim()) {
      anchor.dataset.originalColor = anchor.style.color; // Save current color
      anchor.style.color = "#FFD700"; // Bright yellow (or keep #ffcc00 if you prefer)
      anchor.style.backgroundColor = "#2b2b2b"; // Optional: darker background
      anchor.style.fontWeight = "bold";
      anchor.title = "⚠️ This link was flagged as unsafe by Yorikami Scanner";
    }
  });
}
