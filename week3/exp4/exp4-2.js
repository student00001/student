let activityLog = [];
const logDisplay = document.getElementById('log-display');
const alertBox = document.getElementById('suspicious-alert');

const SUSPICIOUS_LIMIT = 5; 
const TIME_WINDOW = 1000;   
let isPaused = false;       




document.addEventListener('click', (e) => handleEvent(e, 'Capturing'), true);
document.addEventListener('keydown', (e) => handleEvent(e, 'Capturing'), true);
document.addEventListener('focus', (e) => handleEvent(e, 'Capturing'), true); 
const zone = document.getElementById('zone-container');
zone.addEventListener('click', (e) => handleEvent(e, 'Bubbling'));
zone.addEventListener('keydown', (e) => handleEvent(e, 'Bubbling'));


function handleEvent(e, manualPhaseLabel) {
    if (isPaused) return;

    if (e.target.tagName === 'BUTTON' && e.target.parentElement.className === 'controls') return;

    const timestamp = new Date();
    
    let phaseName = manualPhaseLabel;
    let phaseClass = manualPhaseLabel === 'Capturing' ? 'phase-capture' : 'phase-bubble';

    if (e.target === e.currentTarget) {
        phaseName = "Target";
        phaseClass = "phase-target";
    }

    const entry = {
        id: activityLog.length + 1,
        time: timestamp.toLocaleTimeString(),
        rawTime: timestamp.getTime(), 
        type: e.type,
        target: e.target.tagName + (e.target.id ? `#${e.target.id}` : ''),
        phase: phaseName,
        phaseClass: phaseClass
    };

    // Store in Array
    activityLog.push(entry);

    // Update DOM (Req 4)
    renderEntry(entry);

    // Check Suspicious Activity (Req 5)
    detectSuspiciousActivity();
}

// --- REQUIREMENT 4: Dynamic Display ---
function renderEntry(entry) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `
        <span>[${entry.time}] <strong>${entry.type.toUpperCase()}</strong></span>
        <span>${entry.target}</span>
        <span class="${entry.phaseClass}">${entry.phase}</span>
    `;
    
    // Auto-scroll to bottom
    logDisplay.appendChild(div);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

// --- REQUIREMENT 5: Suspicious Activity Detection ---
function detectSuspiciousActivity() {
    const totalLogs = activityLog.length;
    if (totalLogs < SUSPICIOUS_LIMIT) return;

    // Get the last N events
    const recentEvents = activityLog.slice(-SUSPICIOUS_LIMIT);
    
    // Check time difference between the first and last of this slice
    const startTime = recentEvents[0].rawTime;
    const endTime = recentEvents[recentEvents.length - 1].rawTime;

    // If 5 events happened within 1 second (1000ms)
    if ((endTime - startTime) < TIME_WINDOW) {
        triggerWarning();
    }
}

function triggerWarning() {
    isPaused = true;
    alertBox.style.display = 'block';
    
    // Reset warning after 2 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
        isPaused = false;
        // Optionally clear log to prevent immediate re-trigger
        // activityLog = []; 
    }, 2000);
}

// --- REQUIREMENT 6: Export & Reset ---

function resetLog() {
    activityLog = [];
    logDisplay.innerHTML = '<div style="color:gray; text-align:center;">Log Cleared.</div>';
}

function exportLog() {
    if (activityLog.length === 0) {
        alert("No activity to export!");
        return;
    }

    // Format text
    let content = "--- USER ACTIVITY LOG ---\n\n";
    activityLog.forEach(log => {
        content += `[${log.time}] Event: ${log.type}, Target: ${log.target}, Phase: ${log.phase}\n`;
    });

    // Create a Blob (File-like object of immutable raw data)
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a link element, click it, then remove it
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'activity_log.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}