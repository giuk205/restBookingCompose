from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import random
from mydb import miodb
from models.user import User

forgot_bp = Blueprint('forgot', __name__)

@forgot_bp.route('/forgot', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Crea una sessione del database
    db_session = miodb.session

    # Verifica se l'email esiste nel database e che authorizedCode sia null
    user = db_session.query(User).filter_by(email=email, authorizedCode=None).first()
    if not user:
        return jsonify({"error": "Email not found or user not authorized"}), 404

    # Genera una password temporanea
    code = random.randint(100, 999)
    password = generate_password_hash(f'{user.name}{code}', method='pbkdf2:sha256')

    # Aggiorna la password dell'utente nel database
    user.password = password
    db_session.commit()

    # Invia email con la password temporanea (placeholder)
    send_email_with_password(email, password)

    return jsonify({
        'message': 'Password reset instructions have been sent to your email',
        'emailAlert': f'con la nuova password temporanea {user.name}{code}',  # todo: SOLO IN DEVELOPMENT, DA RIMUOVERE
        'idUser': user.idUser
    }), 201

def send_email_with_password(email, password):
    # Funzione placeholder per inviare una email con la password temporanea
    print(f'Email inviata a {email} con la password temporanea: {password}', flush=True)
