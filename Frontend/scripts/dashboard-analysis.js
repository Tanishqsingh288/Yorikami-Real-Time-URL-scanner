async function authFetch(url, options = {}) {
  const { token, sessionId } = await new Promise(resolve => 
    chrome.storage.local.get(['token', 'sessionId'], resolve)
  );

  if (!token || !sessionId) {
    window.location.href = "../auth/auth.html";
    throw new Error("Missing auth tokens");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "x-session-id": sessionId
  };

  let response = await fetch(url, options);
  
  if (response.status === 401) {
    const newToken = await refreshAuthToken();
    if (newToken) {
      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options);
    }
  }

  return response;
}

async function refreshAuthToken() {
  try {
    const { refreshToken } = await new Promise(resolve =>
      chrome.storage.local.get(['refreshToken'], resolve)
    );

    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch("https://yorikamiscanner.duckdns.org/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const { token } = await res.json();
      await new Promise(resolve =>
        chrome.storage.local.set({ token }, resolve)
      );
      return token;
    }
    throw new Error("Token refresh failed");
  } catch (err) {
    console.error("❌ Token refresh error:", err.message);
    chrome.storage.local.remove(['token', 'sessionId', 'refreshToken']);
    window.location.href = "../auth/auth.html";
    return null;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "sessionId", "deepUrls", "reanalyzeTriggered"], async (data) => {
    const { token, sessionId, deepUrls, reanalyzeTriggered } = data;

    if (!token || !sessionId) {
      console.warn("❌ Missing token or sessionId");
      window.location.href = "../auth/auth.html";
      return;
    }

    if (!deepUrls || !Array.isArray(deepUrls) || deepUrls.length === 0) {
      console.warn("⚠️ No deepUrls to process.");
      return;
    }

    const analyseStatus = document.createElement("div");
    analyseStatus.id = "analysis-status";
    analyseStatus.innerText = reanalyzeTriggered
      ? "🔄 Re-analysing the URLs..."
      : "⏳ Analysing unsafe URLs...";
    analyseStatus.style = `
      margin: 10px; 
      padding: 8px; 
      background: #ffe08a; 
      color: #333; 
      font-weight: bold; 
      border-radius: 5px;
    `;
    document.body.prepend(analyseStatus);

    const analyzePromises = deepUrls.map(async (url) => {
      try {
        const res = await authFetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          console.warn(`⚠️ Failed to analyze: ${url}, status: ${res.status}`);
          return { url, status: "error", code: res.status };
        }
        console.log(`✅ Successfully analysed: ${url}`);
        return { url, status: "ok" };
      } catch (err) {
        console.error(`❌ Error analyzing ${url}:`, err);
        return { url, status: "error", error: err.message };
      }
    });

    try {
      const results = await Promise.all(analyzePromises);
      console.log("🔍 Analysis results:", results);

      analyseStatus.innerText = "✅ Deep analysis complete!";
      analyseStatus.style.background = "#a4f9c8";
      analyseStatus.style.color = "#0a0";
    } catch (err) {
      console.error("❌ Analysis failed:", err);
      analyseStatus.innerText = "❌ Analysis failed!";
      analyseStatus.style.background = "#f9a4a4";
      analyseStatus.style.color = "#a00";
    }

    setTimeout(() => {
      analyseStatus.remove();
      chrome.storage.local.remove(["deepUrls", "reanalyzeTriggered"], () => {
        console.log("🧹 Removed deepUrls and reanalyze flag from storage");
      });
    }, 3000);
  });
});