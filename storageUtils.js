export const ONE_HOUR = 60 * 60 * 1000;

export function storeUrlStatus(url, unsafe) {
  const data = { unsafe, timestamp: Date.now() };

  chrome.storage.local.set({ [url]: data });
  pruneOldData();
}

export function pruneOldData() {
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
