<template>
    <div class="popup">
        <h3>Phishing Checker 🎣</h3>
        <p>URL: {{ url }}</p>
        <p v-if="loading">Checking...</p>
        <p v-else-if="unsafe" class="unsafe">‼️ Unsafe URL ‼️</p>
        <p v-else class="safe">✅ Safe URL</p>
        <button @click="recheckUrl" :disabled="loading">Recheck</button>
    </div>
</template>

<script>
import { ONE_HOUR, storeUrlStatus, pruneOldData } from "./storageUtils.js";

export default {
    data() {
        return {
            url: "",
            unsafe: false,
            loading: true,
        };
    },
    mounted() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabUrl = tabs[0].url;
            this.url = tabUrl;

            chrome.storage.local.get(tabUrl, (result) => {
                const storedData = result[tabUrl];
                const now = Date.now();

                if (
                    storedData &&
                    storedData.timestamp &&
                    now - storedData.timestamp <= ONE_HOUR
                ) {
                    this.unsafe = storedData.unsafe;
                    this.loading = false;
                } else {
                    this.checkUrl(tabUrl);
                }

                pruneOldData();
            });
        });
    },
    methods: {
        checkUrl(url) {
            this.loading = true;
            chrome.runtime.sendMessage(
                { type: "checkUrl", url: url },
                (response) => {
                    this.loading = false;

                    if (response && !response.error) {
                        this.unsafe = response.unsafe;

                        storeUrlStatus(url, response.unsafe);
                    }
                },
            );
        },
        recheckUrl() {
            this.checkUrl(this.url);
        },
    },
};
</script>

<style scoped>
.popup {
    width: 300px;
    padding: 10px;
    font-family: Arial, sans-serif;
}
.unsafe {
    color: red;
}
.safe {
    color: green;
}
button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>
