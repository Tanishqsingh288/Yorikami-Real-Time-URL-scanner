console.log("🚀 Analysis.js loaded");

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "sessionId", "deepUrls"], async (data) => {
    const { token, sessionId, deepUrls } = data;

    console.log("📦 chrome.storage.local contents:", { token, sessionId, deepUrls });

    if (!deepUrls || !Array.isArray(deepUrls) || deepUrls.length === 0) {
      console.warn("⚠️ No deepUrls to process.");
      return;
    }

    // Add UI feedback
    const analyseStatus = document.createElement("div");
    analyseStatus.id = "analysis-status";
    analyseStatus.innerText = "⏳ Analysing unsafe URLs...";
    analyseStatus.style = "margin: 10px; padding: 8px; background: #ffe08a; color: #333; font-weight: bold; border-radius: 5px;";
    document.body.prepend(analyseStatus);

    for (const url of deepUrls) {
      try {
        console.log(`📡 Sending analysis request for: ${url}`);

        const res = await fetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId
          },
          body: JSON.stringify({ url })
        });

        if (!res.ok) {
          console.warn(`⚠️ Failed to analyze: ${url}, status: ${res.status}`);
        } else {
          console.log(`✅ Successfully analysed: ${url}`);
        }
      } catch (err) {
        console.error(`❌ Error analyzing ${url}:`, err);
      }
    }

    analyseStatus.innerText = "✅ Deep analysis complete!";
    analyseStatus.style.background = "#a4f9c8";
    analyseStatus.style.color = "#0a0";

    chrome.storage.local.remove("deepUrls", () => {
      console.log("🧹 Removed deepUrls from storage after analysis.");
    });
  });
});
