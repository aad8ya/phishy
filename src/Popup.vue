<template>
    <div>
        <h2>Phishy</h2>
        <button @click="changeColor">Change Background Color</button>
    </div>
</template>

<script>
export default {
    methods: {
        changeColor() {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () =>
                        (document.body.style.backgroundColor = "yellow"),
                });
            });
        },
    },
};
</script>

<style>
body {
    width: 200px;
    padding: 10px;
    text-align: center;
}
button {
    margin-top: 10px;
}
</style>
