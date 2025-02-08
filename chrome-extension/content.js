console.log("Content script running!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`Received message:`, message);

    if (message.action === "play") {
        console.log(Date.now())
        console.log("Received 'play' message in content script. Attempting to start playback...");
        triggerPlayButton();
    }
});

function triggerPlayButton() {
    console.log("Looking for play button...");
    const playButton = document.getElementById("control-play");
    if (playButton) {
        playButton.click();
        console.log(`Play button clicked at: ${Date.now()}`);
    } else {
        console.log("Play button not found");
    }
}

setInterval(() => {
    console.log("🔄 Keeping content script active...");
}, 30000); // Runs every 30 seconds









