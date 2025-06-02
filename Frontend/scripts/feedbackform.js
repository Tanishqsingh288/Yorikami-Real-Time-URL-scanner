const form = document.getElementById('feedbackForm');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageEl.textContent = '';

  const source = form.source.value.trim();
  const content = form.content.value.trim();

  if (!source || !content) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const res = await fetch('https://yorikamiscanner.duckdns.org/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, content })
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.style.color = 'green';
      messageEl.textContent = data.message || 'Thank you for your feedback!';
      form.reset();

      // Show popup
      alert("Your feedback has been submitted!");

      // Wait for 3 seconds, then redirect
      setTimeout(() => {
        window.location.href = chrome.runtime.getURL('webpages/dashboard.html');
      }, 3000);
    } else {
      messageEl.style.color = 'red';
      messageEl.textContent = data.message || 'Failed to send feedback.';
    }
  } catch (err) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Error connecting to server.';
  }
});
