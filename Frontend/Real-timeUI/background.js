chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SYNC_AUTH") {
    chrome.storage.local.set(
      {
        token: message.token,
        sessionId: message.sessionId,
      },
      () => {
        console.log("✅ Synced auth to chrome.storage.local from web");
      }
    );
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_AND_REDIRECT" && Array.isArray(message.urls)) {
    chrome.storage.local.set({ deepUrls: message.urls }, () => {
      console.log("✅ deepUrls stored in background");
      sendResponse({ success: true });
    });
    return true; // Keeps the message channel open for async response
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.type === "CHECK_HTTP_REDIRECT" &&
    typeof message.url === "string"
  ) {
    console.log("🔁 [BG] Received CHECK_HTTP_REDIRECT for:", message.url);

    fetch(message.url, { method: "GET", redirect: "follow" })
      .then((response) => {
        const finalUrl = response.url;
        const redirectsToHttps = finalUrl.startsWith("https://");
        console.log("🔁 [BG] Final resolved URL:", finalUrl);
        sendResponse({ redirectsToHttps });
      })
      .catch((err) => {
        console.error("🔁 [BG] Fetch failed:", err);
        sendResponse({ redirectsToHttps: false });
      });

    return true; // Keep message channel open
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "AUTH_FETCH") {
    chrome.storage.local.get(["token"], async (items) => {
      const token = items.token;

      if (!token) {
        sendResponse({ success: false, error: "No token found" });
        return;
      }

      try {
        const res = await fetch(message.url, {
          method: message.method || "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(message.headers || {})
          },
          body: message.body ? JSON.stringify(message.body) : undefined,
        });

        const contentType = res.headers.get("content-type");
        const isJSON = contentType && contentType.includes("application/json");
        const data = isJSON ? await res.json() : await res.text();

        if (res.status === 401) {
          console.warn("⚠️ Token expired or unauthorized");
          chrome.storage.local.remove(["token", "sessionId"]);
        }

        sendResponse({
          success: res.ok,
          status: res.status,
          data,
        });
      } catch (err) {
        console.error("❌ AUTH_FETCH error:", err);
        sendResponse({ success: false, error: err.message });
      }
    });

    return true; // Keep async message channel open
  }
});
