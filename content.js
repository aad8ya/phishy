import { storeUrlStatus } from "./storageUtils.js";

const currentUrl = window.location.href;

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
