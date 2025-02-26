![image](public/icons/phishy-128.png)
# Phishy - Phishing Checker Browser Extension

A simple Chrome extension built to detect phishing websites using the Google Safe Browsing API, developed as a side quest for a university class to gain hands-on experience in browser extension development.

## Purpose
This project was created to quickly dive into browser extension development. The goal was to build a functional tool that checks websites for phishing risks, learning key concepts like Manifest V3, Vite, Vue.js, Chrome APIs, and API integration along the way.

## Features
- **Automatic Check:** On page load, checks the current URL against the Google Safe Browsing API and alerts if it’s unsafe.
- **Sanitized URLs:** Strips query parameters and fragments (e.g., `https://example.com/page?x=1#y` → `https://example.com/page`) for consistent checking.
- **Local Storage:** Caches results in `chrome.storage.local` with a 1-hour expiry, pruning old entries automatically.
- **Popup UI:** Displays the sanitized URL and safety status (`Safe` or `Unsafe`) with a "Recheck" button for manual updates.
- **Warning Dialog:** Shows an alert for unsafe sites on load (automatic check only, not manual recheck).

## Key Files
- `content.js`: Runs on every page load, sanitizes the URL, checks it via `background.js`, shows an alert if unsafe, and stores the result.
- `Popup.vue`: Displays the URL and status, with a "Recheck" button to manually refresh the check.
- `background.js`: Makes API calls to Google Safe Browsing using a key from `.env`.
- `storageUtils.js`: Contains shared functions (`sanitizeUrl`, `storeUrlStatus`, `pruneOldData`, `ONE_HOUR`) for `Popup.vue`.
- `vite.config.js`: Configures Vite to build the extension with multiple entry points.

## Setup
### Prerequisites
- Node.js
- Yarn
- Chrome browser
- Google Safe Browsing API key (free tier available via Google Cloud Console)

### Installation
1. **Clone the Repository:**
    ```
    git clone https://github.com/aad8ya/phishy.git
    cd phishy
    ```
2. **Install Dependencies:**
    ```
    yarn install
    ```
3. **Set Up API Key:**
    ```
    VITE_GOOGLE_API=your-api-key-here
    ```
    - Create a .env file in the root directory.
    - Get your key from [Google Cloud Console](https://console.cloud.google.com/apis/library/safebrowsing.googleapis.com).
4. **Build the Extension:**
    ```
    yarn build
    ```
    - Outputs to `dist/`.
5. **Load into Chrome:**
    - Open Chrome → `chrome://extensions/` → Enable "Developer mode" → Click "Load unpacked" → Select the `dist/` folder.

## Usage
- **Automatic Check:** Visit any website. If it’s flagged as unsafe (e.g., `http://testsafebrowsing.appspot.com/s/phishing.html`), an alert pops up.
- **Popup:** Click the extension icon to see the sanitized URL and safety status. Hit "Recheck" to manually update.
- **Cache:** Results are cached for 1 hour, pruned automatically after expiry.

## Development Notes
- **Tech Stack:** Built with Vite (bundler), Vue.js (UI), and Manifest V3 (Chrome extension spec).
- **Learning Focus:** Explored Chrome APIs (tabs, storage, runtime), API integration, and modern frontend tooling.
- **Known Issue:** The code in `storageUtils.js` (URL sanitization, storage, pruning) is duplicated in `content.js`. This is an area for improvement—ideally, these should be centralized in a single module, but Chrome’s content script limitations (no native ES modules) forced this workaround.

## Areas for Improvement
- **Remove Duplication:** Refactor to avoid duplicating `storageUtils.js` logic in `content.js`. Possible solution:
  - Use a Vite plugin to inline `storageUtils.js` into `content.js` without `import`/`export`.
- **Custom Alert:** Replace `alert()` with a styled DOM element for a better UX.
- **Error Handling:** Add better feedback for API or storage failures.

## License
This is a learning project and not intended for production use. No formal license is applied—feel free to adapt it for educational purposes!
