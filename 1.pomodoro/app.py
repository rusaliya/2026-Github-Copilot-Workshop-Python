from flask import Flask, render_template, jsonify, request
from datetime import datetime
from db import init_db, save_history, get_history

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/api/history', methods=['GET'])
def api_get_history():
	history = get_history()
	result = [
		{
			'id': row[0],
			'start_time': row[1],
			'end_time': row[2],
			'mode': row[3]
		} for row in history
	]
	return jsonify(result)

@app.route('/api/history', methods=['POST'])
def api_save_history():
	data = request.json
	start_time = data.get('start_time')
	end_time = data.get('end_time')
	mode = data.get('mode')
	save_history(start_time, end_time, mode)
	return jsonify({'result': 'ok'})

if __name__ == '__main__':
	init_db()
	app.run(debug=True, port=5001)
