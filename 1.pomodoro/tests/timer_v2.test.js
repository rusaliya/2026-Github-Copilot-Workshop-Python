// timer_v2.jsのユニットテスト
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Pomodoro Timer v2', () => {
    let window, document;
    beforeEach(() => {
        const html = `
            <div class="status"></div>
            <div id="timer"></div>
            <div id="history"></div>
            <button id="startBtn"></button>
            <button id="pauseBtn"></button>
            <button id="resetBtn"></button>
        `;
        window = new JSDOM(html, { url: 'http://localhost/' }).window;
        document = window.document;
        global.document = document;
        global.window = window;
        // timer_v2.jsの内容を評価
        const timerJs = fs.readFileSync(path.join(__dirname, '../static/js/timer_v2.js'), 'utf8');
        eval(timerJs);
    });
    test('初期状態でtimerは25分', () => {
        expect(document.getElementById('timer').textContent).toBe('25:00');
    });
    test('startTimer, resetTimer関数が存在', () => {
        expect(typeof startTimer).toBe('function');
        expect(typeof resetTimer).toBe('function');
    });
});
