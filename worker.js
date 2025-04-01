const STATIC_SETTINGS = {
    alarmName: "LullReminder",
    alarmAction: "LullShowReminder"
};

const DEFAULT_SETTINGS = {
    interval: 1,
    duration: 5
};

let activeNotificationId = null;
let notificationTimer = null;

function init() {
    setupAlarm();
    chrome.alarms.onAlarm.addListener(handleAlarm);
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && (changes.interval || changes.duration)) {
            setupAlarm();
        }
    })
}

function setupAlarm() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (s) => {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create(STATIC_SETTINGS.alarmName, {
                periodInMinutes: s.interval
            });
        })
    });
}

function handleAlarm(alarm) {
    if (alarm.name !== STATIC_SETTINGS.alarmName) {
        return;
    }

    chrome.storage.sync.get(DEFAULT_SETTINGS, (s) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length <= 0) {
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, {
                action: STATIC_SETTINGS.alarmAction,
                duration: s.duration
            });
        });
    });
}

init();
  