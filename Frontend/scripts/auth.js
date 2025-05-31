const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

const BASE_URL = "https://yorikamiscanner.duckdns.org";

// Attach click listener to toggle link inside toggleText
function attachToggleListener() {
  const toggleLink = document.getElementById("toggleLink");
  if (toggleLink) {
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms();
    });
  }
}

// ✅ Check if already logged in on load
window.addEventListener("DOMContentLoaded", () => {
  // Check token from localStorage
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  if (token && sessionId) {
    // Redirect to dashboard if logged in
    window.location.href = "../webpages/dashboard.html";
  }

  // Also check chrome.storage.local (optional)
  if (chrome?.storage?.local) {
    chrome.storage.local.get(["token", "sessionId"], (items) => {
      if (items.token && items.sessionId) {
        window.location.href = chrome.runtime.getURL('webpages/dashboard.html');
      }
    });
  }

  // Attach listener for toggle link on initial load
  attachToggleListener();
});

function toggleForms() {
  const isLoginHidden = loginForm.classList.contains("d-none");

  if (isLoginHidden) {
    loginForm.classList.remove("d-none");
    signupForm.classList.add("d-none");
    toggleText.innerHTML = `Don't have an account? <a href="#" id="toggleLink">Signup</a>`;
    formTitle.innerText = "Login to YoriKami";
  } else {
    loginForm.classList.add("d-none");
    signupForm.classList.remove("d-none");
    toggleText.innerHTML = `Already have an account? <a href="#" id="toggleLink">Login</a>`;
    formTitle.innerText = "Create your WebGuardX Account";
  }

  // Re-bind event listener after innerHTML change
  attachToggleListener();
}

// ✅ Signup
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    console.log("🔍 Raw signup response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ Failed to parse JSON from signup response:", e);
      alert("❌ Invalid response from server.");
      return;
    }

    if (res.ok) {
      alert("✅ Signup successful! Check email for your guard code.");
      toggleForms();
    } else {
      alert(data.error || "❌ Signup failed");
    }
  } catch (err) {
    alert("❌ Signup error: " + err.message);
  }
});

// ✅ Login
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const guardCode = document.getElementById("loginGuardCode").value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, guardCode }),
    });

    const data = await res.json();

    if (res.ok && data.token && data.sessionId) {
      // Store in both localStorage and chrome.storage.local
      localStorage.setItem("token", data.token);
      localStorage.setItem("sessionId", data.sessionId);
      console.log("📦 Saved to localStorage:", {
        token: localStorage.getItem("token"),
        sessionId: localStorage.getItem("sessionId"),
      });

      if (chrome?.storage?.local) {
        chrome.storage.local.set(
          {
            token: data.token,
            sessionId: data.sessionId,
          },
          () => {
            console.log("🔐 Token & Session saved to chrome.storage.local");
            window.location.href = chrome.runtime.getURL('webpages/dashboard.html');
          }
        );
      } else {
        console.warn("⚠️ chrome.storage.local not available");
        window.location.href = chrome.runtime.getURL('webpages/dashboard.html');
      }
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    alert("❌ Login error: " + (err?.message || "Unknown error"));
  }
});
