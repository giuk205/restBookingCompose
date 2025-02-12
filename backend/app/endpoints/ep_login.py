from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from mydb import miodb
from models.user import User  # Importazione del modello User

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    #print("login endpoint", flush=True)
    data = request.get_json()
    username = data.get('name')
    password = data.get('pwd')
    #print(f'username: {username}, password: {password}', flush=True)
    # Crea una sessione del database 
    db_session = miodb.session
    
    # Trova l'utente per email o nome utente
    user = db_session.query(User).filter((User.email == username) | (User.name == username)).first()
    message = "Nome o email non valido"
    if user:
        if user.deleted == b'\x01':  # Verifica se l'utente è stato cancellato
            return jsonify({"message": message}), 401

        if check_password_hash(user.password, password):
            # Salva le informazioni di sessione
            #print(f'Enpoint /login POST idUser:{user.idUser} ', flush=True)
            session['idUser'] = user.idUser
            session['name'] = user.name
            session['privilege'] = user.privilege
        else:
            message = "Password errata"
            return jsonify({"message": message}), 401
        return jsonify({"message": "Login riuscito", "idUser": user.idUser, "privilege": user.privilege }), 200
    else:
        return jsonify({"message": message}), 401
