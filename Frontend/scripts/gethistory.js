document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  const historyTableBody = document.getElementById("historyTableBody");
  const toggleBtn = document.getElementById("themeToggle");
  const sortDropdown = document.getElementById("sortDropdown");
  const body = document.body;

  // Redirect if not authenticated
  if (!token || !sessionId) {
    window.location.href = "../auth/auth.html";
    return;
  }

  // Theme toggle
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");
  });

  // Render table
  function renderTable(history) {
    historyTableBody.innerHTML = "";
    history.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a></td>
        <td>${new Date(item.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="reanalyze('${item.url}')">Re-analyse</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUrl('${item.url}')">Delete</button>
        </td>
        <td><span class="badge bg-${getRatingColor(item.rating)}">${item.finalScore}/10 (${item.rating})</span></td>
      `;
      historyTableBody.appendChild(row);
    });
  }

  // Get badge color
  function getRatingColor(rating) {
    switch (rating) {
      case "SAFE": return "success";
      case "RISKY": return "warning";
      default: return "danger";
    }
  }

  // Default fetch
  async function fetchHistory() {
    try {
      const res = await fetch("http://13.60.254.185:5000/api/auth/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-session-id": sessionId
        }
      });

      if (!res.ok) throw new Error("History fetch failed");
      const data = await res.json();
      if (Array.isArray(data.history)) renderTable(data.history);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    }
  }

  // Sorting handler
  sortDropdown.addEventListener("change", async (e) => {
    const selected = e.target.value;
    const routeMap = {
      "risk-desc": "history/risk/high-to-low",
      "risk-asc": "history/risk/low-to-high",
      "time-desc": "history/time/recent-first",
      "time-asc": "history/time/oldest-first"
    };

    const route = routeMap[selected];
    if (!route) return;

    try {
      const res = await fetch(`http://13.60.254.185:5000/api/user/${route}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-session-id": sessionId
        }
      });

      const data = await res.json();
      if (Array.isArray(data.sortedHistory)) {
        renderTable(data.sortedHistory);
      }
    } catch (err) {
      console.error("Sorting failed:", err.message);
    }
  });

  // Re-analyze
  window.reanalyze = async function (url) {
    try {
      const res = await fetch("http://13.60.254.185:5000/api/user/reanalyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-session-id": sessionId
        },
        body: JSON.stringify({ url })
      });

      if (res.ok) fetchHistory();
      else alert("Re-analysis failed");
    } catch (err) {
      console.error("Re-analysis error:", err.message);
    }
  };

  // Delete URL
  window.deleteUrl = async function (url) {
    try {
      const res = await fetch("https://yorikamiscanner.duckdns.org/api/user/delete-url", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-session-id": sessionId
        },
        body: JSON.stringify({ url })
      });

      if (res.ok) fetchHistory();
      else alert("Delete failed");
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  fetchHistory(); // Initial history load
});
