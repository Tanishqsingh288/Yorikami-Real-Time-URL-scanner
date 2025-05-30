document.getElementById("updatePasswordForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const guardCode = document.getElementById("guardCode").value;
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  try {
    const res = await fetch("http://13.60.254.185:5000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId
      },
      body: JSON.stringify({ newPassword, guardCode })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message || data.error;
  } catch (err) {
    document.getElementById("message").innerText = "Error updating password.";
  }
});
