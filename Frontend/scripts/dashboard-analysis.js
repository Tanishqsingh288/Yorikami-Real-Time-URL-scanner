window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "sessionId", "deepUrls"], async (data) => {
    const { token, sessionId, deepUrls } = data;

    if (!deepUrls || !Array.isArray(deepUrls) || deepUrls.length === 0) return;

    const analyseStatus = document.createElement("div");
    analyseStatus.innerText = "⏳ Analysing unsafe URLs...";
    analyseStatus.style = "margin: 10px 0; font-weight: bold; color: orange;";
    document.body.prepend(analyseStatus);

    for (const url of deepUrls) {
      try {
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
          console.warn(`Failed to analyze: ${url}`);
        }
      } catch (err) {
        console.error(`Error analyzing ${url}:`, err);
      }
    }

    analyseStatus.innerText = "✅ Deep analysis complete!";
    chrome.storage.local.remove("deepUrls");
  });
});
