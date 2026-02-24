# PomodoroタイマーWebアプリ用DBラッパー

import sqlite3
from contextlib import closing

DB_PATH = 'pomodoro.db'

def init_db():
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS pomodoro_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    start_time TEXT,
                    end_time TEXT,
                    mode TEXT
                )
            ''')

def save_history(start_time, end_time, mode):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute(
                'INSERT INTO pomodoro_history (start_time, end_time, mode) VALUES (?, ?, ?)',
                (start_time, end_time, mode)
            )

def get_history(limit=20):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM pomodoro_history ORDER BY id DESC LIMIT ?', (limit,))
        return cur.fetchall()
