window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "sessionId", "deepUrls"], async (data) => {
    const { token, sessionId, deepUrls } = data;

    if (!deepUrls || !Array.isArray(deepUrls) || deepUrls.length === 0) {
      console.warn("⚠️ No deepUrls to process.");
      return;
    }

    const analyseStatus = document.createElement("div");
    analyseStatus.id = "analysis-status";
    analyseStatus.innerText = "⏳ Analysing unsafe URLs...";
    analyseStatus.style = `
      margin: 10px; 
      padding: 8px; 
      background: #ffe08a; 
      color: #333; 
      font-weight: bold; 
      border-radius: 5px;
    `;
    document.body.prepend(analyseStatus);

    // Use Promise.all to wait for all fetches (mapping to an array of promises)
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

    // Wait for all analysis to finish
    const results = await Promise.all(analyzePromises);

    console.log("🔍 Analysis results:", results);

    // Update UI to say complete
    analyseStatus.innerText = "✅ Deep analysis complete!";
    analyseStatus.style.background = "#a4f9c8";
    analyseStatus.style.color = "#0a0";

    // Remove the message after 3 seconds
    setTimeout(() => {
      analyseStatus.remove();
    }, 3000);

    // Clear deepUrls from storage
    chrome.storage.local.remove("deepUrls", () => {
      console.log("🧹 Removed deepUrls from storage after analysis.");
    });
  });
});
