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
