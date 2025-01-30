from flask import Blueprint, request, jsonify, session
from models.user import User
from mydb import miodb as db
from werkzeug.security import check_password_hash, generate_password_hash
from enum import Enum

class UserType(Enum):
    SUPERADMIN = 0
    ADMIN = 10
    MANAGER = 20
    STAFF = 30
    USER = 40

# Creazione del Blueprint per l'endpoint utente
user_bp = Blueprint('user', __name__)

@user_bp.route('/user', methods=['GET'])
def get_user():
    try:
        # Recupera l'id dell'utente dalla query string o dalla sessione
        id_user = request.args.get('idUser', type=int) or session.get('idUser')
        if not id_user:
            return jsonify({"error": "Utente non autenticato"}), 401
        
        # Cerca l'utente nel database
        user = User.query.get(id_user)
        if not user:
            return jsonify({"error": "Utente non trovato"}), 404
        
        # Restituisce i dati dell'utente escludendo la password
        return jsonify({
            'id': user.idUser,
            'username': user.name,
            'email': user.email,
            'phone': user.phone,
            'authorizedCode': user.authorizedCode,
            'privilege': user.privilege,
            'adminNote': user.adminNote,
            'updateDate': user.updateDate
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/user', methods=['POST'])
def update_user():
    try:
        # Recupera i dati dalla richiesta JSON
        data = request.json
        id_user = session.get('idUser')  # Ottiene l'id utente dalla sessione
        if not id_user:
            return jsonify({"error": "Utente non autenticato"}), 401
        
        # Cerca l'utente che sta facendo la richiesta nel database
        requesting_user = User.query.get(id_user)
        if not requesting_user:
            return jsonify({"error": "Utente non trovato"}), 404
        
        # Cerca l'utente da modificare nel database
        user_id_to_update = data.get('idUser', id_user)
        user_to_update = User.query.get(user_id_to_update)
        if not user_to_update:
            return jsonify({"error": "Utente da modificare non trovato"}), 404
        
        # Controlla i privilegi dell'utente
        if requesting_user.privilege  == UserType.MANAGER.value and user_to_update.privilege  > UserType.USER.value:
            return jsonify({"error": "Privilegi insufficienti per modificare l'utente"}), 403
        if requesting_user.privilege  == UserType.ADMIN.value and user_to_update.privilege  <= UserType.ADMIN.value and user_to_update.privilege  > UserType.SUPERADMIN.value:
            return jsonify({"error": "Privilegi insufficienti per modificare l'utente"}), 403
        
        # Controlla se il nuovo nome o email sono già in uso da altri utenti
        new_name = data.get('name', user_to_update.name)
        new_email = data.get('email', user_to_update.email)
        
        existing_user_name = User.query.filter(User.name == new_name, User.idUser != user_id_to_update).first()
        existing_user_email = User.query.filter(User.email == new_email, User.idUser != user_id_to_update).first()
        
        if existing_user_name:
            return jsonify({"error": "Nome utente già in uso"}), 400
        if existing_user_email:
            return jsonify({"error": "Email già in uso"}), 400
        
        # Aggiornamento dei dati utente con valori nuovi o mantenendo quelli esistenti
        user_to_update.name = new_name
        user_to_update.email = new_email
        user_to_update.phone = data.get('phone', user_to_update.phone)
        
        # Salva le modifiche nel database
        db.session.commit()
        return jsonify({"message": "Dati aggiornati con successo"})
    except Exception as e:
        db.session.rollback()  # Annulla le modifiche in caso di errore
        return jsonify({"error": str(e)}), 500

@user_bp.route('/user', methods=['DELETE'])
def delete_user():
    try:
        id_user = session.get('idUser')
        if not id_user:
            return jsonify({"error": "Utente non autenticato"}), 401
        
        user = User.query.get(id_user)
        if not user:
            return jsonify({"error": "Utente non trovato"}), 404
        
        # Controlla i privilegi dell'utente
        if id_user != user:
            if id_user.privilege  > UserType.ADMIN.value or (id_user.privilege  == UserType.ADMIN.value and user.privilege  == UserType.ADMIN.value):
                return jsonify({"error": "Privilegi insufficienti per cancellare l'utente"}), 403
        
        # Funzione placeholder per eliminare ordini associati all'utente
        delete_user_orders(id_user)
        
        # Modifica nome ed email per evitare problemi di unicità
        user.name = f'#{user.name}'
        user.email = f'#{user.email}'
        if id_user != user:
            user.adminNote += f'Utente cancellato da: {id_user}\n'
        # Imposta il flag deleted a True invece di eliminare fisicamente l'utente
        user.deleted = True
        
        db.session.commit()
        
        return jsonify({"message": "Utente cancellato con successo"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def delete_user_orders(id_user):
    # Placeholder: qui si dovrebbe implementare la logica per eliminare gli ordini associati all'utente
    pass
