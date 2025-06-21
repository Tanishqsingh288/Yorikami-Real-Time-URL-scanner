// ✅ gethistory.js

document.addEventListener("DOMContentLoaded", () => {
  const historyTableBody = document.getElementById("historyTableBody");
  const toggleBtn = document.getElementById("themeToggle");
  const sortDropdown = document.getElementById("sortDropdown");
  const body = document.body;
  const TOKEN_REFRESH_INTERVAL = 1 * 60 * 1000;

  // ========== AUTH HANDLING ==========

  async function authFetch(url, options = {}) {
    const { token, sessionId } = await getValidAuth();
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
        await new Promise(resolve => chrome.storage.local.set({ token }, resolve));
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

  async function getValidAuth() {
    const { token, sessionId } = await new Promise(resolve =>
      chrome.storage.local.get(["token", "sessionId"], resolve)
    );
    if (!token || !sessionId) {
      window.location.href = "../auth/auth.html";
      throw new Error("Missing auth tokens");
    }
    return { token, sessionId };
  }

  // ========== HISTORY TABLE ==========

  function getRatingColor(rating) {
    switch (rating) {
      case "SAFE": return "success";
      case "RISKY": return "warning";
      default: return "danger";
    }
  }

  function renderTable(history) {
    historyTableBody.innerHTML = "";
    history.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer"
            style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
            overflow: hidden; text-overflow: ellipsis; word-break: break-word;
            white-space: normal; line-height: 1.4; max-width: 400px;
            color: blue; text-decoration: underline; cursor: default;
            pointer-events: none; user-select: text;">
            ${item.url}
          </a>
        </td>
        <td>${new Date(item.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-success reanalyze-btn" data-url="${item.url}">Re-analyse</button>
          <button class="btn btn-sm btn-danger delete-btn" data-url="${item.url}">Delete</button>
        </td>
        <td><span class="badge bg-${getRatingColor(item.rating)}" style="color: #fff;">
          ${item.finalScore}/10 (${item.rating})</span></td>
      `;
      historyTableBody.appendChild(row);
    });

    document.querySelectorAll(".reanalyze-btn").forEach(btn =>
      btn.addEventListener("click", () => reanalyze(btn.dataset.url))
    );

    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", () => deleteUrl(btn.dataset.url))
    );
  }

  async function fetchSortedHistory(route = "history/time/recent-first") {
    try {
      const res = await authFetch(`https://yorikamiscanner.duckdns.org/api/user/${route}`);
      if (!res.ok) throw new Error("History fetch failed");

      const data = await res.json();
      const history = data.sortedHistory || data.history;
      if (Array.isArray(history)) renderTable(history);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    }
  }

  // ========== USER ACTIONS ==========

  window.reanalyze = async function (url) {
    try {
      const res = await authFetch("https://yorikamiscanner.duckdns.org/api/user/reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (res.ok) {
        chrome.storage.local.get(["deepUrls"], (result) => {
          const deepUrls = Array.isArray(result.deepUrls) ? result.deepUrls : [];
          if (!deepUrls.includes(url)) deepUrls.push(url);
          chrome.storage.local.set({ deepUrls }, () => startDeepAnalysis(deepUrls));
        });
        fetchSortedHistory();
      } else {
        alert("Re-analysis failed");
      }
    } catch (err) {
      console.error("Re-analysis error:", err.message);
    }
  };

  function startDeepAnalysis(deepUrls) {
    const popup = document.createElement("div");
    popup.className = "deep-analysis-popup";
    popup.style = `
      position: fixed; bottom: 20px; right: 20px;
      background: #111; color: #fff; padding: 15px;
      border-radius: 8px; z-index: 9999; font-family: Arial;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;
    popup.textContent = "⏳ Analysing unsafe URLs...";
    document.body.appendChild(popup);

    (async () => {
      try {
        for (const url of deepUrls) {
          const res = await authFetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
          });

          res.ok
            ? console.log(`✅ Analysed: ${url}`)
            : console.warn(`⚠️ Failed to analyse ${url}`);
        }

        popup.textContent = "✅ Deep analysis complete! Refreshing...";
        setTimeout(() => {
          popup.remove();
          chrome.storage.local.remove("deepUrls");
          fetchSortedHistory();
        }, 1500);
      } catch (err) {
        console.error("❌ Deep analysis failed:", err.message);
        popup.textContent = "❌ Analysis failed.";
        setTimeout(() => popup.remove(), 2000);
      }
    })();
  }

  window.deleteUrl = async function (url) {
    try {
      const res = await authFetch("https://yorikamiscanner.duckdns.org/api/user/delete-url", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (res.ok) fetchSortedHistory();
      else alert("Delete failed");
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  // ========== INITIALIZATION ==========

  chrome.storage.local.get(['token', 'refreshToken'], ({ token, refreshToken }) => {
    if (token && refreshToken) {
      setInterval(refreshAuthToken, TOKEN_REFRESH_INTERVAL);
    }
  });

  getValidAuth().then(() => {
    toggleBtn?.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      body.classList.toggle("light-theme");
    });

    document.getElementById("sortDropdownMenu")?.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("dropdown-item")) return;
      const routeMap = {
        "risk-desc": "history/risk/high-to-low",
        "risk-asc": "history/risk/low-to-high",
        "time-desc": "history/time/recent-first",
        "time-asc": "history/time/oldest-first"
      };
      const route = routeMap[e.target.dataset.value];
      if (route) fetchSortedHistory(route);
    });

    fetchSortedHistory();
  });

  chrome.storage.local.get(["userEmail"], ({ userEmail }) => {
    const emailElement = document.getElementById("loggedInAs");
    if (userEmail && emailElement) {
      emailElement.textContent = `Logged in as: ${userEmail}`;
    }
  });

  chrome.storage.local.get(["deepUrls"], async ({ deepUrls }) => {
    if (!Array.isArray(deepUrls) || deepUrls.length === 0) return;

    const popup = document.createElement("div");
    popup.className = "auto-analysis-popup";
    popup.style = `
      position: fixed; bottom: 20px; right: 20px;
      background: #111; color: #fff; padding: 15px;
      border-radius: 8px; z-index: 9999; font-family: Arial;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;
    popup.textContent = "⏳ Auto analysing pending URLs...";
    document.body.appendChild(popup);

    try {
      for (const url of deepUrls) {
        const res = await authFetch("https://yorikamiscanner.duckdns.org/api/check/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });

        res.ok
          ? console.log(`✅ Auto-analysed: ${url}`)
          : console.warn(`⚠️ Failed auto-analysis for: ${url}`);
      }

      popup.textContent = "✅ Auto analysis complete!";
      setTimeout(() => {
        popup.remove();
        chrome.storage.local.remove("deepUrls");
        location.reload();
      }, 1500);
    } catch (err) {
      console.error("❌ Auto deep analysis failed:", err.message);
      popup.textContent = "❌ Auto analysis failed.";
      setTimeout(() => popup.remove(), 2000);
    }
  });
});