<template>
    <div class="popup">
        <h3>Phishing Checker 🎣</h3>
        <p>URL: {{ url }}</p>
        <p v-if="loading">Checking...</p>
        <p v-else-if="unsafe" class="unsafe">⚠️ Unsafe URL ⚠️</p>
        <p v-else class="safe">✅ Safe URL</p>
    </div>
</template>

<script>
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

            chrome.runtime.sendMessage(
                { type: "checkUrl", url: tabUrl },
                (response) => {
                    this.loading = false;
                    if (response && !response.error) {
                        this.unsafe = response.unsafe;
                    }
                },
            );
        });
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
</style>
