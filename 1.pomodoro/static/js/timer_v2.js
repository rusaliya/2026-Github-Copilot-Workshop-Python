// Pomodoro履歴取得・保存API連携、状態切替・UI拡張

let timer = 25 * 60;
let interval = null;
let isRunning = false;
let mode = 'focus'; // 'focus' or 'break'
let pomodoroCount = 0;
let startTime = null;

const timerDisplay = document.getElementById('timer');
const gaugeCanvas = document.getElementById('timerGauge');
const gaugeCtx = gaugeCanvas.getContext('2d');
const GAUGE_RADIUS = 80;
const GAUGE_LINE_WIDTH = 10;
const FOCUS_TOTAL = 25 * 60;
const BREAK_TOTAL = 5 * 60;
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDiv = document.querySelector('.status');
const historyDiv = document.getElementById('history');

function updateDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // Gauge描画
    let total = mode === 'focus' ? FOCUS_TOTAL : BREAK_TOTAL;
    let elapsed = total - timer;
    drawGauge(elapsed / total, mode);
    if (mode === 'focus') {
        statusDiv.textContent = '集中時間';
        statusDiv.style.color = '#e57373';
        timerDisplay.style.color = '#333';
    } else {
        statusDiv.textContent = '休憩時間';
        statusDiv.style.color = '#64b5f6';
        timerDisplay.style.color = '#1976d2';
    }
}

function drawGauge(percent, mode) {
    gaugeCtx.clearRect(0, 0, gaugeCanvas.width, gaugeCanvas.height);
    // 背景円
    gaugeCtx.beginPath();
    gaugeCtx.arc(gaugeCanvas.width/2, gaugeCanvas.height/2, GAUGE_RADIUS, 0, 2 * Math.PI);
    gaugeCtx.strokeStyle = '#eee';
    gaugeCtx.lineWidth = GAUGE_LINE_WIDTH;
    gaugeCtx.stroke();
    // 進捗円弧
    let color = mode === 'focus' ? '#e57373' : '#64b5f6';
    gaugeCtx.beginPath();
    gaugeCtx.arc(
        gaugeCanvas.width/2,
        gaugeCanvas.height/2,
        GAUGE_RADIUS,
        -Math.PI/2,
        -Math.PI/2 + 2 * Math.PI * percent,
        false
    );
    gaugeCtx.strokeStyle = color;
    gaugeCtx.lineWidth = GAUGE_LINE_WIDTH;
    gaugeCtx.lineCap = 'round';
    gaugeCtx.stroke();
}

function switchMode() {
    if (mode === 'focus') {
        mode = 'break';
        timer = 5 * 60;
    } else {
        mode = 'focus';
        timer = 25 * 60;
        pomodoroCount++;
    }
    updateDisplay();
}

function startTimer() {
    if (!isRunning && timer > 0) {
        isRunning = true;
        if (!startTime) startTime = new Date().toISOString();
        interval = setInterval(() => {
            timer--;
            updateDisplay();
            if (timer <= 0) {
                clearInterval(interval);
                isRunning = false;
                const endTime = new Date().toISOString();
                saveHistory(startTime, endTime, mode);
                startTime = null;
                if (mode === 'focus') {
                    alert('集中時間が終了しました！休憩しましょう。');
                } else {
                    alert('休憩が終了しました！次の集中へ。');
                }
                switchMode();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
    }
}

function resetTimer() {
    pauseTimer();
    mode = 'focus';
    timer = 25 * 60;
    startTime = null;
    updateDisplay();
}

function saveHistory(start, end, mode) {
    fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_time: start, end_time: end, mode: mode })
    });
}

function fetchHistory() {
    fetch('/api/history')
        .then(res => res.json())
        .then(data => {
            historyDiv.innerHTML = '<h3>履歴</h3>' +
                '<ul>' + data.map(item => `<li>${item.mode} ${item.start_time} ~ ${item.end_time}</li>`).join('') + '</ul>';
        });
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
fetchHistory();
setInterval(fetchHistory, 60000); // 1分ごとに履歴更新
