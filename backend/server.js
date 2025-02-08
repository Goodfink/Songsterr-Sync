const WebSocket = require("ws");
const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 3000;
const WSS_PORT = 8080;
const DELAY = 5000;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "127.0.0.1";
}

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/ip", (req, res) => {
    const ip = getLocalIP();
    sendLog(`Serving Local IP: ${ip}`);
    res.send(ip);
});

app.listen(PORT, () => {
    sendLog(`Frontend available at http://${getLocalIP()}:${PORT}`);
});

const wss = new WebSocket.Server({ port: WSS_PORT });
sendLog(`WebSocket server running on ws://${getLocalIP()}:${WSS_PORT}`);

function sendLog(message) {
    console.log(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "log", message }));
        }
    });
}

function sendClientCount() {
    const count = wss.clients.size - 1;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "clientCount", count }));
        }
    });
}

wss.on("connection", (ws) => {
    sendClientCount();
    sendLog(`Client Connected: Total Users ${wss.clients.size - 1}`);

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "play") {
                const syncTime = Date.now() + DELAY;
                sendLog(`Leader triggered playback. Target time: ${new Date(syncTime).toISOString()}`);
                sendLog(`Sending 'play' command with target time: ${syncTime}`);

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "play", targetTime: syncTime }));
                    }
                });
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    });

    ws.on("close", () => {
        sendLog(`Client disconnected: Total Users ${wss.clients.size - 1}`);
        sendClientCount();
    });
});









