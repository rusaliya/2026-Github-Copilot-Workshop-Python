import unittest
from db import init_db, save_history, get_history
from datetime import datetime, timedelta

class TestDB(unittest.TestCase):
    def setUp(self):
        init_db()

    def test_save_and_get_history(self):
        start = datetime.now().isoformat()
        end = (datetime.now() + timedelta(minutes=25)).isoformat()
        save_history(start, end, 'focus')
        history = get_history(limit=1)
        self.assertEqual(history[0][3], 'focus')

if __name__ == '__main__':
    unittest.main()
