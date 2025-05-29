document.getElementById("updateEmailForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newEmail = document.getElementById("newEmail").value;
  const currentPassword = document.getElementById("currentPassword").value;
  const guardCode = document.getElementById("guardCode").value;
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("sessionId");

  try {
    const res = await fetch("http://localhost:5000/api/auth/update-email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionId
      },
      body: JSON.stringify({ newEmail, currentPassword, guardCode })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message || data.error;
  } catch (err) {
    document.getElementById("message").innerText = "Error updating email.";
  }
});
