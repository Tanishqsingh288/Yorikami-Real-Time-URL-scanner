chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SYNC_AUTH") {
    chrome.storage.local.set({
      token: message.token,
      sessionId: message.sessionId
    }, () => {
      console.log("✅ Synced auth to chrome.storage.local from web");
    });
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
