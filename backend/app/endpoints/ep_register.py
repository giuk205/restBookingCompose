from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta, timezone
import random
from mydb import miodb
from models.user import User

register_bp = Blueprint('register', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    phone = data.get('phone')
    code = data.get('code')

    if not email or not name or not phone:
        return jsonify({'errore': 'Email, nome e telefono sono richiesti'}), 400

    # Crea una sessione del database
    db_session = db_session = miodb.session

    new_user = User(email=email, name=name, phone=phone)

    # Verifica se è un manage/admin/owner a registrare un utente
    idUser = session.get('idUser')  # Prendiamo l'id dalla sessione, chi effettua la registrazione
    if code == 999 and idUser:        
        code = 0

    if code:
        if code == 9999:
            # Verifica se email presente nel database e se utente autorizzato
            authorized_user = db_session.query(User).filter_by(email=email).first()
            if not authorized_user:
                return jsonify({'errore': 'Email non presente nel sistema'}), 400
            if authorized_user.authorizedCode != None:
                return jsonify({'errore': 'Utente ancora da autenticare, richiedi codice e completa registrazione'}), 400
            name = authorized_user.name
        else:
            # Verifica del codice di autorizzazione
            authorized_user = db_session.query(User).filter_by(email=email, authorizedCode=code).first()
            if not authorized_user:
                return jsonify({'errore': 'Codice di autorizzazione non valido o già utilizzato'}), 400
    
            # Converti authorized_user.updateDate in un datetime offset-aware
            if authorized_user.updateDate.tzinfo is None:
                authorized_user.updateDate = authorized_user.updateDate.replace(tzinfo=timezone.utc)

            if authorized_user.updateDate + timedelta(minutes=30) < datetime.now(timezone.utc):
                return jsonify({'errore': 'Codice di autorizzazione scaduto'}), 400

        # Autorizzazione dello user
        code = random.randint(100, 999)
        password = generate_password_hash(f'{name}{code}', method='pbkdf2:sha256')
        authorized_user.password = password
        authorized_user.authorizedCode = None
        db_session.commit()

        # Invia email con la password temporanea (placeholder)
        send_email_with_password(email, password)

        return jsonify({
            'message': 'Utente autorizzato con successo',
            'emailAlert': f'con la password {name}{code}',      # todo: SOLO IN DEVELOPMENT, DA RIMUOVERE
            'idUser': authorized_user.idUser
        }), 201
    else:
        # Pre-registrazione dell'utente
        
        # Verifica se l'utente esiste già con lo stesso nome o email NON DISCRIMINA TRA email e nome
        #existing_user = db_session.query(User).filter((User.email == email) | (User.name == name)).first()
        #if existing_user:
        #    return jsonify({'errore': 'L\'email o il nome sono già registrati'}), 400
        existing_user = db_session.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'errore': 'L\'email è già registrata'}), 400
        existing_user = db_session.query(User).filter(User.name == name).first()
        if existing_user:
            return jsonify({'errore': 'Il nome è già utilizzato'}), 400




        if db_session.query(User).filter_by(email=email).first() or db_session.query(User).filter_by(name=name).first():
            return jsonify({'errore': 'Email o nome già in uso'}), 400

        code = random.randint(100, 999)
        new_user.authorizedCode = code
        password = generate_password_hash(f'{name}{code}', method='pbkdf2:sha256')
        new_user.password = password
        new_user.updateDate = datetime.now(timezone.utc)

        try:
            db_session.add(new_user)
            db_session.commit()

            if idUser:   
                new_user.authorizedCode = None
                db_session.commit()

                # Invia email con la password temporanea (placeholder)
                send_email_with_password(email, password)

                return jsonify({
                    'message': 'Utente autorizzato con successo',
                    'emailAlert': f'con la password temporanea {name}{code}',      # todo: SOLO IN DEVELOPMENT, DA RIMUOVERE
                    'idUser': new_user.idUser
                }), 201
                


            # Invia email con il codice (placeholder)
            send_email_with_code(email, code)

            return jsonify({
                'message': 'Utente preregistrato con successo',
                'emailAlert': f'con il codice: {code}'       # todo: SOLO IN DEVELOPMENT, DA RIMUOVERE
            }), 201
        except Exception as e:
            db_session.rollback()
            return jsonify({'error': str(e)}), 500

def send_email_with_password(email, password):
    # Funzione placeholder per inviare una email con la password temporanea
    print(f'Email inviata a {email} con la password temporanea: {password}', flush=True)

def send_email_with_code(email, code):
    # Funzione placeholder per inviare una email con il codice di autorizzazione
    print(f'Email inviata a {email} con il codice di autorizzazione: {code}', flush=True)
