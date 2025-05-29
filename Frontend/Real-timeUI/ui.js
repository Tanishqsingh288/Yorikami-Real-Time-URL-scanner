let unsafeUrls = [];

window.addEventListener('message', (event) => {
  if (event.data.type === 'INIT_UI') {
    const { total, unsafe } = event.data;
    unsafeUrls = unsafe;

    document.getElementById('summary').innerText =
      `Scanned ${total} URLs. ⚠️ ${unsafe.length} unsafe links found.`;

    const list = document.getElementById('urlList');
    unsafe.forEach(url => {
      const li = document.createElement('li');
      li.innerText = url;
      list.appendChild(li);
    });
  }
});

document.getElementById('analyseBtn').addEventListener('click', () => {
  window.parent.postMessage({ type: 'RUN_ANALYSIS' }, '*');
});
