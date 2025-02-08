document.addEventListener("DOMContentLoaded", function () {
    const ipInput = document.getElementById("server-ip");
    const saveButton = document.getElementById("saveIp");
    const statusElement = document.getElementById("status");
    let ws = null;

    checkConnection();

    if (!ipInput || !saveButton) {
        console.error("Elements not found! Check your popup.html IDs.");
        return;
    }

    chrome.storage.local.get(["serverIP"], (data) => {
        if (data.serverIP) {
            ipInput.value = data.serverIP;
            console.log("Loaded saved IP:", data.serverIP);

            const savedMessage = document.createElement("p");
            savedMessage.innerText = `Saved IP: ${data.serverIP}`;
            savedMessage.style.color = "green";
            document.body.appendChild(savedMessage);
        } else {
            console.warn("⚠No IP found in storage.");
        }
    });

    // Save IP when button is clicked
    saveButton.addEventListener("click", () => {
        const ip = ipInput.value.trim();

        if (!ip) {
            alert("Please enter a valid server IP.");
            return;
        }

        chrome.storage.local.set({ serverIP: ip }, () => {
            console.log("IP saved successfully:", ip);

            alert(`IP saved: ${ip}`);

            checkConnection();
        });
    });

    function checkConnection() {
        chrome.runtime.sendMessage({ action: "checkConnection" }, (response) => {
            if (response && response.connected) {
                statusElement.innerHTML = "Status: Connected";
                statusElement.classList.remove("disconnected");
                statusElement.classList.add("connected");
            } else {
                statusElement.innerHTML = "Status: Disconnected";
                statusElement.classList.remove("connected");
                statusElement.classList.add("disconnected");
            }
        });
    }
});










