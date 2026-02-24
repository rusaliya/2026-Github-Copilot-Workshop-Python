// timer.jsのユニットテスト
// Jestを使用
const fs = require('fs');
const path = require('path');

// timer.jsの内容を取得
const timerJsPath = path.join(__dirname, '../static/js/timer.js');
const timerJs = fs.readFileSync(timerJsPath, 'utf8');

eval(timerJs); // timer.jsのグローバル関数を評価

describe('Pomodoro Timer', () => {
    test('timer should initialize correctly', () => {
        expect(typeof startTimer).toBe('function');
        expect(typeof resetTimer).toBe('function');
    });
    // 追加テスト例: startTimerの動作
    // test('startTimer should start countdown', () => {
    //     // モックやDOM操作が必要
    // });
});
