document.getElementById("payBtn").addEventListener("click", async () => {
  const amountInput = document.getElementById("amount");
  const statusDiv = document.getElementById("statusMessage");
  const amount = parseInt(amountInput.value);

  if (!amount || amount < 1) {
    statusDiv.innerText = "❗ Please enter a valid amount.";
    statusDiv.style.color = "red";
    return;
  }

  try {
    statusDiv.innerText = "⏳ Creating order...";
    const res = await fetch("https://yorikamiscanner.duckdns.org/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { order } = await res.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // 🔁 Replace with your live Razorpay Key ID
      amount: order.amount,
      currency: order.currency,
      name: "WebGuardX",
      description: "Donation Support",
      order_id: order.id,
      handler: function (response) {
        statusDiv.innerText = `✅ Thank you! Payment ID: ${response.razorpay_payment_id}`;
        statusDiv.style.color = "green";
        amountInput.value = "";
      },
      theme: { color: "#00c9a7" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("❌ Payment failed", err);
    statusDiv.innerText = "❌ Payment failed. Try again later.";
    statusDiv.style.color = "red";
  }
});
