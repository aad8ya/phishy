const currentUrl = window.location.href;

function storeUrlStatus(url, unsafe) {
  chrome.storage.local.set({ [url]: { unsafe, timestamp: Date.now() } });
}

chrome.runtime.sendMessage(
  { type: "checkUrl", url: currentUrl },
  (response) => {
    if (response && !response.error) {
      storeUrlStatus(currentUrl, response.unsafe);
    } else {
      console.error("Error hitting the Google API:", response?.error);
    }
  },
);
