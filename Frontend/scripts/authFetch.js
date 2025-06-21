export async function authFetch(url, options = {}) {
  // Get tokens from preferred storage
  let token, sessionId;
  if (chrome?.storage?.local) {
    const items = await new Promise(resolve => 
      chrome.storage.local.get(['token', 'sessionId'], resolve)
    );
    token = items.token;
    sessionId = items.sessionId;
  } else {
    token = localStorage.getItem("token");
    sessionId = localStorage.getItem("sessionId");
  }

  if (!token || !sessionId) {
    window.location.href = "../auth/auth.html";
    return;
  }

  // Set auth headers
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "x-session-id": sessionId
  };

  let response = await fetch(url, options);
  
  // Handle token expiration
  if (response.status === 401) {
    const newToken = await refreshAuthToken();
    if (newToken) {
      // Retry with new token
      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options);
    } else {
      return; // Already redirected to login
    }
  }

  return response;
}