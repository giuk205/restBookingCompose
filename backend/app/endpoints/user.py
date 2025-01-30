from flask import Blueprint, request, jsonify, session
from models.user import User
from mydb import miodb as db
from werkzeug.security import check_password_hash, generate_password_hash

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
            'admin': user.admin,
            'adminNote': user.adminNote,
            'staff': user.staff,
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
        
        # Cerca l'utente nel database
        user = User.query.get(id_user)
        if not user:
            return jsonify({"error": "Utente non trovato"}), 404
        
        # Controlla se il nuovo nome o email sono già in uso da altri utenti
        new_name = data.get('name', user.name)
        new_email = data.get('email', user.email)
        
        existing_user_name = User.query.filter(User.name == new_name, User.idUser != id_user).first()
        existing_user_email = User.query.filter(User.email == new_email, User.idUser != id_user).first()
        
        if existing_user_name:
            return jsonify({"error": "Nome utente già in uso"}), 400
        if existing_user_email:
            return jsonify({"error": "Email già in uso"}), 400
        
        # Aggiornamento dei dati utente con valori nuovi o mantenendo quelli esistenti
        user.name = new_name
        user.email = new_email
        user.phone = data.get('phone', user.phone)
        user.adminNote = data.get('adminNote', user.adminNote)
        
        # Controlla se è richiesta la modifica della password
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        if old_password and new_password:
            # Verifica se la vecchia password è corretta
            if not check_password_hash(user.password, old_password):
                return jsonify({"error": "Vecchia password errata"}), 400
            # Genera un hash per la nuova password
            user.password = generate_password_hash(new_password)
        
        # Salva le modifiche nel database
        db.session.commit()
        return jsonify({"message": "Dati aggiornati con successo"})
    except Exception as e:
        db.session.rollback()  # Annulla le modifiche in caso di errore
        return jsonify({"error": str(e)}), 500
