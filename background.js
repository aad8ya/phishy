const apiKey = import.meta.env.VITE_GOOGLE_API;

async function checkUrl(url) {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  const reqBody = {
    client: {
      clientId: "phishy",
      clientVersion: "0.2.2",
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    return data.matches
      ? { unsafe: true, details: data.matches }
      : { unsafe: false };
  } catch (error) {
    console.error("Error in hitting up the Google safe browsing API", error);

    return { unsafe: false, error: true };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "checkUrl") {
    checkUrl(message.url).then((result) => {
      sendResponse(result);
    });

    return true;
  }
});
