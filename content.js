const currentUrl = window.location.href;

chrome.runtime.sendMessage(
  { type: "checkUrl", url: currentUrl },
  (response) => {
    if (response.error) {
      console.log("Error checking URL");
    } else if (response.unsafe) {
      console.log("Unsafe URL");
      console.log("Threat details", response.details);
    } else {
      console.log("Safe URL");
    }
  },
);
