window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "sessionId", "deepUrls", "reanalyzeTriggered"], async (data) => {
    const { token, sessionId, deepUrls, reanalyzeTriggered } = data;

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
        console.log(`📡 Sending analysis request for: ${url}`);

        const res = await fetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
          body: JSON.stringify(url),
        });

        if (!res.ok) {
          console.warn(`⚠️ Failed to analyze: ${url}, status: ${res.status}`);
          return { url, status: "error", code: res.status };
        } else {
          console.log(`✅ Successfully analysed: ${url}`);
          return { url, status: "ok" };
        }
      } catch (err) {
        console.error(`❌ Error analyzing ${url}:`, err);
        return { url, status: "error", error: err.message };
      }
    });

    const results = await Promise.all(analyzePromises);

    console.log("🔍 Analysis results:", results);

    analyseStatus.innerText = "✅ Deep analysis complete!";
    analyseStatus.style.background = "#a4f9c8";
    analyseStatus.style.color = "#0a0";

    setTimeout(() => {
      analyseStatus.remove();
    }, 3000);

    chrome.storage.local.remove(["deepUrls", "reanalyzeTriggered"], () => {
      console.log("🧹 Removed deepUrls and reanalyze flag from storage after analysis.");
    });
  });
});
