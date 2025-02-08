const SERVER_URL = "ws://localhost:8080";
const ws = new WebSocket(SERVER_URL);
const statusEl = document.getElementById("status");
const playButton = document.getElementById("playButton");
const logContainer = document.getElementById("logContainer");
const userCountEl = document.getElementById("userCount");

ws.onopen = () => {
    console.log("Connected to WebSocket server");
    statusEl.textContent = "Connected";
    statusEl.style.color = "green";
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "play") {
        console.log("Received PLAY command! Triggering playback...");
        window.postMessage("play", "*");
    }
};

playButton.addEventListener("click", () => {
    console.log("Leader clicked Play. Sending event to server...");
    ws.send(JSON.stringify({ type: "play" }));
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "log") {
        console.log(`Log: ${data.message}`);
        const logMessage = document.createElement("p");
        logMessage.innerText = data.message;
        logContainer.appendChild(logMessage);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    if (data.type === "clientCount") {
        userCountEl.textContent = data.count;
    }
};

ws.onclose = () => {
    console.log("Disconnected from WebSocket server");
    statusEl.textContent = "Disconnected";
    statusEl.style.color = "red";
};

