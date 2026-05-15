# Songsterr-Sync
Here’s a README file for your **Songsterr-Sync** project:

---

# Songsterr Sync

**Songsterr Sync** is a Chrome extension and WebSocket server that allows band members to **synchronize Songsterr playback** across multiple devices on the same local network.

## Features

- **Sync playback** between multiple users
- **WebSocket-based communication**
- **Live server logs on the frontend**
- **Track active users**
- **User-friendly UI with connection status**

---

## Installation

### ** Clone the Repository**
```sh
git clone https://github.com/Goodfink/Songsterr-Sync.git
cd Songsterr-Sync
```

### ** Install Dependencies**
```sh
npm install
```

### ** Start the WebSocket Server**
```sh
node backend/server.js
```
This will:
- Start the WebSocket server (`ws://<your-local-ip>:8080`)
- Serve the frontend at (`http://<your-local-ip>:3000`)

---

## Setting Up the Chrome Extension

### ** Load the Extension in Chrome**
1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `chrome-extension/` folder

### ** Configure the Extension**
- Open the extension popup
- Enter the **server IP** (found in the terminal after running `server.js`)
- Click **Save**
- The status should show **Connected** if everything works correctly

---

## How to Use

### **Starting Playback Sync**
1. Open **Songsterr**
2. Ensure all band members have the extension connected
3. Click **Start Sync** in the frontend
4. All connected devices will **play at the same time!** 🎵

### **Viewing Logs**
The **frontend UI** displays:
- Active users
- Playback events
- Server logs

---

## Troubleshooting

### **Common Issues**
| Issue | Solution |
|--------|----------|
| WebSocket won't connect | Ensure the server is running (`node server.js`) |
| Status shows Disconnected | Check that you entered the correct **server IP** in the extension |
| Logs don’t appear | Refresh the frontend (`http://<your-local-ip>:3000`) |
