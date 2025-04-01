function saveOptions() {
    const interval = document.getElementById('interval').value;
    const duration = document.getElementById('duration').value;

    chrome.storage.sync.set({
        interval: parseInt(interval, 10),
        duration: parseInt(duration, 10)
    }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 1500);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        interval: 45,
        duration: 5
    }, (items) => {
        document.getElementById('interval').value = items.interval;
        document.getElementById('duration').value = items.duration;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
