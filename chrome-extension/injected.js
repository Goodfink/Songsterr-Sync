(function() {
    console.log("Injected script is running...");

    function sendRealKeyPress() {
        console.log("Clicking to focus before sending Space...");
        document.body.click();

        setTimeout(() => {
            console.log("🎵 Sending Space key event...");

            let event = new KeyboardEvent("keydown", {
                key: " ",
                code: "Space",
                keyCode: 32,
                which: 32,
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(event);
            console.log("Space key event dispatched!");
        }, 200);
    }

    window.addEventListener("message", (event) => {
        if (event.data === "play") {
            console.log("'play' message received in injected script.");
            sendRealKeyPress();
        }
    });

    console.log("Injected script successfully added event listener for 'play' message.");
})();


