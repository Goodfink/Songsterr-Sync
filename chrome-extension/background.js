let socket;

function connectWebSocket() {
    chrome.storage.local.get(["serverIP"], (data) => {
        if (!data.serverIP) {
            console.error("No stored IP found. Please set it in the popup.");
            return;
        }

        const SERVER_URL = `ws://${data.serverIP}:8080`;
        console.log(`🔌 Connecting to WebSocket at ${SERVER_URL}`);
        socket = new WebSocket(SERVER_URL);

        socket.onopen = () => {
            console.log("Connected to WebSocket server!");

            // Send a keep-alive ping every 20 seconds to prevent disconnection
            socket.keepAlive = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "ping" }));
                    console.log("📡 Sent keep-alive ping");
                }
            }, 20000);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "play") {
                const receivedTime = Date.now();
                const timeUntilPlay = data.targetTime - receivedTime; // Calculate wait time

                console.log(`Received PLAY command! Target time: ${new Date(data.targetTime).toISOString()}`);
                console.log(`Waiting ${timeUntilPlay}ms before triggering playback...`);

                if (timeUntilPlay > 0) {
                    setTimeout(() => {
                        console.log("▶️ Time reached! Playing now...");
                        chrome.tabs.query({ url: "*://www.songsterr.com/*" }, (tabs) => {
                            if (tabs.length > 0) {
                                chrome.tabs.sendMessage(tabs[0].id, { action: "play" }, (response) => {
                                    if (chrome.runtime.lastError) {
                                        console.error("Error sending message:", chrome.runtime.lastError.message);
                                    } else {
                                        console.log("Play command successfully sent!");
                                    }
                                });
                            } else {
                                console.error("No active Songsterr tab found.");
                            }
                        });
                    }, timeUntilPlay);
                } else {
                    console.warn("⚠Target time already passed, playing immediately...");
                    chrome.tabs.query({ url: "*://www.songsterr.com/*" }, (tabs) => {
                        if (tabs.length > 0) {
                            chrome.tabs.sendMessage(tabs[0].id, { action: "play" });
                        }
                    });
                }
            }
        };

        socket.onclose = (event) => {
            console.warn(`⚠WebSocket closed unexpectedly (code: ${event.code}). Reconnecting...`);
            clearInterval(socket.keepAlive); // Clear keep-alive interval
            setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
        };

        socket.onerror = (err) => {
            console.error("WebSocket Error:", err);
            socket.close(); // Force reconnect on error
        };
    });
}

// Start WebSocket connection
connectWebSocket();

chrome.storage.onChanged.addListener((changes) => {
    if (changes.serverIP) {
        console.log("🔄 IP changed, reconnecting...");
        socket?.close();
        connectWebSocket();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkConnection") {
        const isConnected = socket && socket.readyState === WebSocket.OPEN;
        console.log(`🔌 Checking connection: ${isConnected ? "Connected" : "Disconnected"}`);
        sendResponse({ connected: isConnected });
    }
    return true;
});




