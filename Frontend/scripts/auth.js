// Existing constants
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const TOKEN_REFRESH_INTERVAL = 1 * 60 * 1000;
const BASE_URL = "https://yorikamiscanner.duckdns.org";



// ✅ Add this helper function for token refresh
async function refreshAuthToken() {
  try {
    const { refreshToken } = await new Promise(resolve =>
      chrome.storage.local.get(['refreshToken'], resolve)
    );

    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const { token } = await res.json();

      localStorage.setItem("token", token);
      if (chrome?.storage?.local) {
        await new Promise(resolve =>
          chrome.storage.local.set({ token }, resolve)
        );
      }
      return token;
    }
    throw new Error("Refresh failed");
  } catch (err) {
    console.error("Token refresh failed:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    if (chrome?.storage?.local) {
      await new Promise(resolve =>
        chrome.storage.local.remove(['token', 'sessionId', 'refreshToken'], resolve)
      );
    }
    window.location.href = "../auth/auth.html";
    return null;
  }
}


// Attach toggle link
function attachToggleListener() {
  const toggleLink = document.getElementById("toggleLink");
  if (toggleLink) {
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  if (token && sessionId) {
    window.location.href = "../webpages/dashboard.html";
  }

  if (chrome?.storage?.local) {
    chrome.storage.local.get(["token", "sessionId"], (items) => {
      if (items.token && items.sessionId) {
        window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
      }
    });
  }

  attachToggleListener();

  // Attach checkbox control logic
  const agreementCheckbox = document.getElementById("signupAgreement");
  const signupBtn = document.getElementById("signupBtn");

  if (agreementCheckbox && signupBtn) {
    agreementCheckbox.addEventListener("change", () => {
      signupBtn.disabled = !agreementCheckbox.checked;
    });
  }
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
    formTitle.innerText = "Create your YoriKami Account";
  }

  attachToggleListener();

  // Refresh checkbox logic
  const agreementCheckbox = document.getElementById("signupAgreement");
  const signupBtn = document.getElementById("signupBtn");

  if (agreementCheckbox && signupBtn) {
    signupBtn.disabled = !agreementCheckbox.checked;
    agreementCheckbox.addEventListener("change", () => {
      signupBtn.disabled = !agreementCheckbox.checked;
    });
  }
}

// Signup handler
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  alert("🔐 You are Signed in ..");

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
      alert(
        "✅ Signup successful! Please check your email for your unique Guard Code. Keep it secure and never share it."
      );
      toggleForms();
    } else {
      alert(data.error || "❌ Signup failed");
    }
  } catch (err) {
    alert("❌ Signup error: " + err.message);
  }
});

// Login handler remains unchanged...

/// ✅ Login
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  alert("🔐 You are logged in.");

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

    if (res.ok && data.token && data.refreshToken && data.sessionId) {
      // Store in both localStorage and chrome.storage.local
      localStorage.setItem("token", data.token);
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("userEmail", email);
      console.log("📦 Saved to localStorage:", {
        token: localStorage.getItem("token"),
        sessionId: localStorage.getItem("sessionId"),
        userEmail: email,
      });

      if (chrome?.storage?.local) {
        chrome.storage.local.set(
          {
            token: data.token,
            refreshToken: data.refreshToken,
            sessionId: data.sessionId,
            userEmail: email,
          },
          () => {
            console.log("🔐 Token & Session saved to chrome.storage.local");
            // Start token refresh interval AFTER storage is confirmed
            setInterval(async () => {
              await refreshAuthToken();
            }, TOKEN_REFRESH_INTERVAL);
            
            window.location.href = chrome.runtime.getURL(
              "webpages/dashboard.html"
            );
          }
        );
      } else {
        console.warn("⚠️ chrome.storage.local not available");
        window.location.href = chrome.runtime.getURL("webpages/dashboard.html");
      }
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    alert("❌ Login error: " + (err?.message || "Unknown error"));
  }
});
// Enable/Disable Signup button based on checkbox
const checkbox = document.getElementById("signupConfirmCheckbox");
const signupBtn = document.getElementById("signupSubmitBtn");

checkbox.addEventListener("change", () => {
  signupBtn.disabled = !checkbox.checked;
});
