import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app


class PomodoroAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Pomodoro', response.data)

    def test_history_api(self):
        # POST履歴保存
        res = self.app.post('/api/history', json={
            'start_time': '2024-01-01T00:00:00',
            'end_time': '2024-01-01T00:25:00',
            'mode': 'focus'
        })
        self.assertEqual(res.status_code, 200)
        # GET履歴取得
        res = self.app.get('/api/history')
        self.assertEqual(res.status_code, 200)
        self.assertIn('focus', res.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()
