
from flask import Flask, request, jsonify
import db
import json

app = Flask(__name__)
app.config['DEBUG'] = True


@app.route('/')
def home():
    return 'Welcome to the Flask Postgres App!'

# flaskAppTable
@app.route('/read/<name>', methods=['GET'])
def read(name):
    print(name)
    query = f"SELECT * FROM {name};"
    try:
        result = db.read_from_db(query)
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/write', methods=['POST'])
# def write():
#     data = request.json
#     query = f'INSERT INTO {db_table} (name, job_profile, phone) VALUES (%s, %s, %s);'
#     params = (data['name'], data['job_profile'], data['phone'])
#     try:
#         db.write_to_db(query, params)
#         return jsonify({'message': 'Data inserted successfully!'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)