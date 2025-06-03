document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  const historyTableBody = document.getElementById("historyTableBody");
  const toggleBtn = document.getElementById("themeToggle");
  const sortDropdown = document.getElementById("sortDropdown");
  const body = document.body;

  if (!token || !sessionId) {
    window.location.href = "../auth/auth.html";
    return;
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");
  });

  function renderTable(history) {
    historyTableBody.innerHTML = "";
    history.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer"
            style="
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-word;
              white-space: normal;
              line-height: 1.4;
              max-width: 400px;
              color: blue;
              text-decoration: underline;
              cursor: default;
              pointer-events: none;
              user-select: text;
            "
          >
            ${item.url}
          </a>
        </td>
        <td>${new Date(item.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-success reanalyze-btn" data-url="${
            item.url
          }">Re-analyse</button>
          <button class="btn btn-sm btn-danger delete-btn" data-url="${
            item.url
          }">Delete</button>
        </td>
        <td><span class="badge bg-${getRatingColor(item.rating)}">${
        item.finalScore
      }/10 (${item.rating})</span></td>
      `;
      historyTableBody.appendChild(row);
    });

    document.querySelectorAll(".reanalyze-btn").forEach((btn) => {
      btn.addEventListener("click", () => reanalyze(btn.dataset.url));
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteUrl(btn.dataset.url));
    });
  }

  function getRatingColor(rating) {
    switch (rating) {
      case "SAFE":
        return "success";
      case "RISKY":
        return "warning";
      default:
        return "danger";
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(
        "https://yorikamiscanner.duckdns.org/api/auth/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
        }
      );

      if (!res.ok) throw new Error("History fetch failed");
      const data = await res.json();
      if (Array.isArray(data.history)) renderTable(data.history);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    }
  }

  // Replace the sortDropdown event listener with this:
document.getElementById('sortDropdownMenu').addEventListener('click', async (e) => {
  if (e.target.classList.contains('dropdown-item')) {
    const selected = e.target.dataset.value;
    const routeMap = {
      "risk-desc": "history/risk/high-to-low",
      "risk-asc": "history/risk/low-to-high",
      "time-desc": "history/time/recent-first",
      "time-asc": "history/time/oldest-first",
    };

    const route = routeMap[selected];
    if (!route) return;

    try {
      const res = await fetch(
        `https://yorikamiscanner.duckdns.org/api/user/${route}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
        }
      );

      const data = await res.json();
      if (Array.isArray(data.sortedHistory)) {
        renderTable(data.sortedHistory);
      }
    } catch (err) {
      console.error("Sorting failed:", err.message);
    }
  }
});
  window.reanalyze = async function (url) {
  try {
    const res = await fetch(
      "https://yorikamiscanner.duckdns.org/api/user/reanalyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ url }),
      }
    );

    if (res.ok) {
      // Add the URL to deepUrls in chrome.storage.local
      chrome.storage.local.get(["deepUrls"], (result) => {
        const deepUrls = Array.isArray(result.deepUrls) ? result.deepUrls : [];
        if (!deepUrls.includes(url)) {
          deepUrls.push(url);
          chrome.storage.local.set({ deepUrls }, () => {
            // Trigger the deep analysis popup & processing (copied from your existing code)
            startDeepAnalysis(deepUrls);
          });
        } else {
          // If already in deepUrls, just start analysis
          startDeepAnalysis(deepUrls);
        }
      });

      fetchHistory(); // update the table too
    } else {
      alert("Re-analysis failed");
    }
  } catch (err) {
    console.error("Re-analysis error:", err.message);
  }
};
function startDeepAnalysis(deepUrls) {
  const analysingPopup = document.createElement("div");
  analysingPopup.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: #111; color: #fff; padding: 15px;
    border-radius: 8px; z-index: 9999; font-family: Arial;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;
  analysingPopup.textContent = "⏳ Analysing unsafe URLs...";
  document.body.appendChild(analysingPopup);

  (async () => {
    try {
      for (const url of deepUrls) {
        const res = await fetch(
          "https://yorikamiscanner.duckdns.org/api/check/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "x-session-id": sessionId,
            },
            body: JSON.stringify({ url }),
          }
        );

        if (res.ok) {
          console.log(`✅ Analysed: ${url}`);
        } else {
          console.warn(`⚠️ Failed to analyse ${url}`);
        }
      }

      analysingPopup.textContent = "✅ Deep analysis complete! Refreshing...";
      setTimeout(() => {
        analysingPopup.remove();
        chrome.storage.local.remove("deepUrls");
        fetchHistory();
      }, 1500);
    } catch (err) {
      console.error("❌ Deep analysis failed:", err.message);
      analysingPopup.textContent = "❌ Analysis failed.";
      setTimeout(() => analysingPopup.remove(), 2000);
    }
  })();
}


  window.deleteUrl = async function (url) {
    try {
      const res = await fetch(
        "https://yorikamiscanner.duckdns.org/api/user/delete-url",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (res.ok) fetchHistory();
      else alert("Delete failed");
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  fetchHistory();

  chrome.storage?.local?.get(["deepUrls"], async (result) => {
    const deepUrls = result.deepUrls;

    if (!Array.isArray(deepUrls) || deepUrls.length === 0) return;

    const analysingPopup = document.createElement("div");
    analysingPopup.style = `
      position: fixed; bottom: 20px; right: 20px;
      background: #111; color: #fff; padding: 15px;
      border-radius: 8px; z-index: 9999; font-family: Arial;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;
    analysingPopup.textContent = "⏳ Analysing unsafe URLs...";
    document.body.appendChild(analysingPopup);

    try {
      for (const item of deepUrls) {
        const res = await fetch(
          "https://yorikamiscanner.duckdns.org/api/check/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "x-session-id": sessionId,
            },
            body: JSON.stringify({ url: item.url }),
          }
        );

        if (res.ok) {
          console.log(`✅ Analysed: ${item.url}`);
        } else {
          console.warn(`⚠️ Failed to analyse ${item.url}`);
        }
      }

      analysingPopup.textContent = "✅ Deep analysis complete! Refreshing...";
      setTimeout(() => {
        analysingPopup.remove();
        chrome.storage.local.remove("deepUrls");
        fetchHistory();
      }, 1500);
    } catch (err) {
      console.error("❌ Deep analysis failed:", err.message);
      analysingPopup.textContent = "❌ Analysis failed.";
      setTimeout(() => analysingPopup.remove(), 2000);
    }
  });
});
