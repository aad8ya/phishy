const ONE_HOUR = 60 * 60 * 1000;

function sanitizeUrl(url) {
  const urlObj = new URL(url);

  return urlObj.origin + urlObj.pathname;
}

function storeUrlStatus(url, unsafe) {
  const sanitizedUrl = sanitizeUrl(url);
  const data = { unsafe, timestamp: Date.now() };

  chrome.storage.local.set({ [sanitizedUrl]: data });
  pruneOldData();
}

function pruneOldData() {
  chrome.storage.local.get(null, (items) => {
    const now = Date.now();
    const toRemove = [];

    for (const [url, data] of Object.entries(items)) {
      if (data.timestamp && now - data.timestamp > ONE_HOUR) {
        toRemove.push(url);
      }
    }

    if (toRemove.length > 0) {
      chrome.storage.local.remove(toRemove);
    }
  });
}

const currentUrl = window.location.href;
const sanitizedUrl = sanitizeUrl(currentUrl);

chrome.runtime.sendMessage(
  { type: "checkUrl", url: sanitizedUrl },
  (response) => {
    if (response && !response.error) {
      if (response.unsafe) {
        alert(
          "⚠️ Warning: This site may be unsafe! It could be a phishing attempt.",
        );
      }
      storeUrlStatus(sanitizedUrl, response.unsafe);
    } else {
      console.error("Error hitting the Google API:", response?.error);
    }
  },
);
