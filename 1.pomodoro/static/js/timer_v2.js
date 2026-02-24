// Pomodoro履歴取得・保存API連携、状態切替・UI拡張

let timer = 25 * 60;
let interval = null;
let isRunning = false;
let mode = 'focus'; // 'focus' or 'break'
let pomodoroCount = 0;
let startTime = null;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDiv = document.querySelector('.status');
const historyDiv = document.getElementById('history');

function updateDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
