document.getElementById("logoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const guardCode = document.getElementById("guardCode").value;
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  try {
    const res = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId
      },
      body: JSON.stringify({ guardCode })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message || data.error;

    if (res.ok) {
      localStorage.clear();
      setTimeout(() => window.location.href = "../auth/auth.html", 2000);
    }
  } catch (err) {
    document.getElementById("message").innerText = "Logout failed.";
  }
});
