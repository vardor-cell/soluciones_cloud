
from flask import Flask, request, jsonify, make_response
import db
import jwt
import datetime
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = "secretkey"

@app.route('/')
def home():
    return 'Welcome to the Flask Postgres App!'

#Decorator to valite the token and to authorize the use of critical APIs
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization') # http://127.0.0.1:5000/route?token=alshfjfjfdklsfj89549834ur
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            data = jwt.decode(token, key = app.config['SECRET_KEY'],algorithms='HS256')

        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        

        return f(*args, **kwargs)
    
    return decorated

#API TO GET ALL USERS ---> This is a test API i made to learn flask
@app.route('/list_users', methods=['GET'])
@token_required
def read():
    query = f"SELECT * FROM usuario;"
    try:
        result = db.read_from_db(query)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#API TO CREATE A NEW USER
@app.route('/usuario', methods=['POST'])
def usuario():
    data = request.json
    query = f'INSERT INTO usuario (nombre_usuario, contrasenia, imagen_perfil) VALUES (%s, %s, %s);'
    params = (data['nombre_usuario'], data['contrasenia'], data['imagen_perfil'])
    try:
        db.write_to_db(query, params)
        return jsonify({'message': 'Data inserted successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#API MAKE THE LOGIN TO THE APP AND CREATE THE TOKEN TO MAKE THE AUTH IN THE DIFFERENT APIS
@app.route('/login', methods=['POST'])
def login():
    try:
        auth = request.authorization

        if auth:
                query = f"SELECT * FROM usuario WHERE nombre_usuario = '{str(auth.username)}';"

                result = db.read_from_db(query)
                
                if len(result) == 0:
                    return make_response(
            'Could not find the user!',
            404,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        )
  
                if auth.password == result[0]['contrasenia']:
 
                    token = jwt.encode(
                        {'user': auth.username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5)},
                        app.config["SECRET_KEY"],  # Replace 'secret_key' with your actual secret key
                        algorithm='HS256'
                    )

                    return jsonify({'token': token, 'id_usuario': result[0]['id'] })

        return make_response(
            'Could not verify!',
            401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#API TO GET ALL TASKS OF AN USER
@app.route('/usuarios/<id>/tareas', methods=['GET'])
@token_required
def read_task(id):
    query = f"SELECT * FROM tarea WHERE id_usuario = '{id}';"
    try:
        result = db.read_from_db(query)

        for task in result:
            task['fecha_creacion'] = task['fecha_creacion'].strftime('%Y-%m-%d')
            task['fecha_tentativa_finalizacion'] = task['fecha_tentativa_finalizacion'].strftime('%Y-%m-%d')

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#API TO CREATE TASKS
@app.route('/tareas', methods=['POST'])
@token_required
def tareas():
    data = request.json
    query = f"INSERT INTO public.tarea(texto_tarea, fecha_creacion, fecha_tentativa_finalizacion, estado, id_usuario, id_categoria) VALUES (%s,%s,%s,%s ,%s,%s);"
    params = (data['texto_tarea'], data['fecha_creacion'], data['fecha_tentativa_finalizacion'], data['estado'], data['id_usuario'],data['id_categoria'])
    
    if datetime.datetime.strptime(data['fecha_creacion'], "%Y-%m-%d") > datetime.datetime.strptime(data['fecha_tentativa_finalizacion'], "%Y-%m-%d"):
        return jsonify({'error': 'first date is bigger than end date'}), 500

    try:
        db.write_to_db(query, params)
        return jsonify({'message': 'Data inserted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#API TO UPDATE STATE AND TEXT OF A TASK
@app.route('/tareas/<id>', methods=['PUT','DELETE','GET'])
@token_required
def editar_tareas(id):
    
    if request.method == 'PUT':
        data = request.json
        
        if "texto_tarea" in data and "estado" in data:
            query = f"UPDATE public.tarea SET estado = '{data['estado']}', texto_tarea = '{data['texto_tarea']}' WHERE id = {id}"

        elif "texto_tarea" in data:
            query = f"UPDATE public.tarea SET texto_tarea = '{data['texto_tarea']}' WHERE id = {id}"
        elif "estado" in data:
            query = f"UPDATE public.tarea SET estado = '{data['estado']}' WHERE id = {id}"
        else:
            return jsonify({'error': 'BAD REQUEST, PAYLOAD IS WRONGLY MADE'}), 400
        
        try:
            db.write_to_db(query)
            return jsonify({'message': 'Data updated successfully!'}), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    if request.method == 'DELETE':
        
        try:
            query = f"DELETE FROM public.tarea WHERE id = {id}"
            db.write_to_db(query)

            return jsonify({'message': 'Data delete successfully!'}), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    if request.method == 'GET':
        query = f"SELECT * FROM public.tarea WHERE id = {id};"
        try:
            result = db.read_from_db(query)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    
#API TO UPDATE STATE AND TEXT OF A TASK
@app.route('/categorias', methods=['POST','GET'])
@token_required
def categorias():
    
    if request.method == 'POST':
        data = request.json
        
        query = f"INSERT INTO public.categoria(nombre, descripcion) VALUES  (%s, %s);"
        params = (data['nombre'], data['descripcion'])
        
        try:
            db.write_to_db(query,params)
            return jsonify({'message': 'Data inserted successfully!'}), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    if request.method == 'GET':
        
        query = f"SELECT * FROM categoria;"
        try:
            result = db.read_from_db(query)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        

#DELETE A CATEGORY 
@app.route('/categorias/<id>', methods=['DELETE'])
@token_required
def delete_categorias(id):      
    if request.method == 'DELETE':
    
        try:
            query = f"DELETE FROM public.categoria WHERE id = {id}"
            db.write_to_db(query)

            return jsonify({'message': 'Data delete successfully!'}), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)