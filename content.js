const STATIC_SETTINGS = {
    alarmName: "LullReminder",
    alarmAction: "LullShowReminder",
    overlayId: "lull-overlay"
};

let timer = 0;
let timerBox;
let intervalId;

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = STATIC_SETTINGS.overlayId;
    overlay.style.cssText = `
        font-family: Montserrat, sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9999999;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const messageBox = document.createElement("div");
    messageBox.style.cssText = `
        background-color: #F4FFC3;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 24rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        color: #5D8736;
    `;
    
    timerBox = document.createElement("p");
    timerBox.style.cssText = `
        font-size: 1.5rem;
        color: #5D8736;
        font-weight: 700;
    `;
    timerBox.innerHTML = "-";

    const closeButton = document.createElement("button");
    closeButton.id = "lull-close-btn";
    closeButton.style.cssText = `
        background: #5D8736;
        color: white; 
        border: none; 
        padding: .5rem 1rem; 
        border-radius: .5rem; 
        cursor: pointer; 
        margin-top: .5rem;
    `;
    closeButton.textContent = "Close";

    messageBox.innerHTML = `
        <h2>Time for a Break</h2>
        <p style="font-size: .75rem;">Step away from your screen for a few minutes</p>
        <p style="font-size: .75rem;">Your mind and body will thank you</p>
    `;
    messageBox.appendChild(timerBox);
    messageBox.appendChild(closeButton);

    overlay.appendChild(messageBox);

    document.body.appendChild(overlay);
    closeButton.addEventListener("click", function() {
        clean();
    });
}

function updateMessageBox() {
    if (!timerBox) {
        return;
    }
    timerBox.innerHTML = `${timer}s`;
    timer--;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action !== STATIC_SETTINGS.alarmAction) {
        return;
    }
    if (document.getElementById(STATIC_SETTINGS.overlayId)) {
        return;
    }

    createOverlay();

    timer = message.duration * 60;
    intervalId = setInterval(() => {
        updateMessageBox();
    }, 1000);

    setTimeout(() => {
        clean();
    }, message.duration * 60 * 1000);

});

function clean() {
    const overlay = document.getElementById(STATIC_SETTINGS.overlayId);
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}