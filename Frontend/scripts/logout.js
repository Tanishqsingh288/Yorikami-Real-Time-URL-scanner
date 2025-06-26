document.getElementById("logoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  alert("✅ You Successfully logged out of your Yorikami account. Please check the Email. for the confirmation.")

  const guardCode = document.getElementById("guardCode").value;
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  try {
    const res = await fetch("https://yorikamiscanner.duckdns.org/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId
      },
      body: JSON.stringify({ guardCode })
    });

    const data = await res.json();
    
    // Show popup message
    const popup = document.createElement('div');
    popup.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #111;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      font-family: Arial, sans-serif;
    `;
    popup.textContent = "You are logged out";
    document.body.appendChild(popup);

    if (res.ok) {
      // Clear localStorage
      localStorage.clear();
      
      // Clear chrome.storage.local if available
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove(['token', 'sessionId'], () => {
          //console.log('Removed from chrome.storage.local');
        });
      }
      
      // Close window after 3 seconds
      setTimeout(() => {
        window.location.href = "../auth/auth.html";
        // If you want to close the tab/window completely instead of redirecting:
        // window.close();
      }, 3000);
    } else {
      document.getElementById("message").innerText = data.error || "Logout failed";
      setTimeout(() => popup.remove(), 3000);
    }
  } catch (err) {
    document.getElementById("message").innerText = "Logout failed. Please try again.";
    //console.error("Logout error:", err);
  }
});