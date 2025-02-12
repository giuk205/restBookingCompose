from flask import Blueprint, request, jsonify, session
from models.user import User
from models.reservation import Reservation
from mydb import miodb as db
from werkzeug.security import check_password_hash, generate_password_hash
from enum import Enum

class UserType(Enum):
    OWNER = 0
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
        user_id_to_update = data.get('id', id_user)
        user_to_update = User.query.get(user_id_to_update)
        if not user_to_update:
            return jsonify({"error": "Utente da modificare non trovato"}), 404
        
        # Controlla i privilegi dell'utente
        if user_id_to_update != id_user:
            if requesting_user.privilege  == UserType.MANAGER.value and user_to_update.privilege  > UserType.USER.value:
                return jsonify({"error": "Privilegi insufficienti per modificare l'utente"}), 403
            if requesting_user.privilege  == UserType.ADMIN.value and user_to_update.privilege  <= UserType.ADMIN.value and user_to_update.privilege  > UserType.OWNER.value:
                return jsonify({"error": "Privilegi insufficienti per modificare utente"}), 403
        
        new_name = data.get('name', user_to_update.name)
        new_email = data.get('email', user_to_update.email)
        new_privilege = data.get('privilege', user_to_update.privilege)

        # Controlla se il nuovo nome o email sono già in uso da altri utenti
        #print(f'ep_user() new_name: {new_name} mentre user_to_update.name: {user_to_update.name} user_id_to_update:{user_id_to_update}', flush=True)
        if (new_name != user_to_update.name):
            existing_user_name = User.query.filter(User.name == new_name, User.idUser != user_id_to_update).first()
            if existing_user_name:
                return jsonify({"error": "Nome utente già in uso"}), 400

        if (new_email != user_to_update.email):
            existing_user_email = User.query.filter(User.email == new_email, User.idUser != user_id_to_update).first()
            if existing_user_email:
                return jsonify({"error": "Email già in uso"}), 400
        
        # Aggiornamento dei dati utente con valori nuovi o mantenendo quelli esistenti
        user_to_update.name = new_name
        user_to_update.email = new_email
        user_to_update.phone = data.get('phone', user_to_update.phone)
        user_to_update.adminNote = data.get('adminNote', user_to_update.adminNote)
        
        # Controlla se è richiesta la modifica della password
        old_password = data.get('oldPasswordFake')
        new_password = data.get('newPassword')
        if old_password and new_password:
            # Verifica se la vecchia password è corretta
            if not check_password_hash(user_to_update.password, old_password):
                return jsonify({"error": "Vecchia password errata"}), 400
            # Genera un hash per la nuova password
            user_to_update.password = generate_password_hash(new_password, method='pbkdf2:sha256')
            
        new_privilege = data.get('privilege')
        if new_privilege is not None:
            try:
                new_privilege = int(new_privilege)
                if (new_privilege != int(user_to_update.privilege)): #diversi da prima
                    if (new_privilege > int(requesting_user.privilege)):
                        user_to_update.privilege = new_privilege
            except ValueError:
                print("Errore: 'privilege' deve essere un numero intero.")
        
        # Salva le modifiche nel database
        db.session.commit()
        return jsonify({"message": "Dati aggiornati con successo"})
    except Exception as e:
        db.session.rollback()  # Annulla le modifiche in caso di errore
        return jsonify({"error": str(e)}), 500

@user_bp.route('/user', methods=['DELETE'])
def delete_user():
    try:
        # Recupero l'ID dell'utente autenticato dalla sessione
        id_user = session.get('idUser')
        if not id_user:
            return jsonify({"error": "Utente non autenticato"}), 401
        
        # Recupero l'ID dell'utente da eliminare
        id_user_to_delete = request.args.get('idUser', type=int)
        if not id_user_to_delete:
            return jsonify({"error": "ID utente non valido"}), 400
    
        # Recupero l'utente dal database
        user = User.query.get(id_user_to_delete)
        if not user:
            return jsonify({"error": "Utente non trovato"}), 404
        
        # Controllo privilegi:
        # l'utente può eliminare sé stesso
        # il manager può eliminare USER
        # admin può eliminare USER, STAFF, MANAGER
        # owner può eliminare USER, STAFF, MANAGER, ADMIN
        print(f'ep_user() id_user: {id_user} mentre id_user_to_delete: {id_user_to_delete}', flush=True)
        if id_user != id_user_to_delete:
            # Se l'utente autenticato non ha abbastanza privilegi, blocca l'operazione
            privilege = int(session.get('privilege', -1))  # -1 se non esiste
            print(f'ep_user() session privilege: {privilege} ', flush=True)
            # Mappa dei privilegi
            privileges_allowed = {
                UserType.MANAGER.value: [UserType.USER.value],
                UserType.ADMIN.value: [UserType.USER.value, UserType.STAFF.value, UserType.MANAGER.value],
                UserType.OWNER.value: [UserType.USER.value, UserType.STAFF.value, UserType.MANAGER.value, UserType.ADMIN.value]
            }
            if privilege not in privileges_allowed or user.privilege not in privileges_allowed[privilege]:
                print(f'ep_user() Privilegi insufficienti per cancellare  ', flush=True)
                return jsonify({"error": "Privilegi insufficienti per cancellare l'utente"}), 403

            print(f'ep_user() ok, procedo a cancellare prenotazioni ', flush=True)
        
        # Funzione placeholder per eliminare ordini associati all'utente
        # delete_user_orders(id_user, id_user_to_delete)
        print(f'ep_user() prenotazioni cancellate', flush=True)
        
        # Modifica nome ed email per evitare problemi di unicità
        user.name = f'#{user.name}'
        user.email = f'#{user.email}'

        # Aggiunta nota amministrativa se l'utente è stato eliminato da un altro
        if id_user != id_user_to_delete:
            user.adminNote = (user.adminNote or '') + f'Utente cancellato da: {id_user}\n'

        # Imposta il flag deleted a True invece di eliminare fisicamente l'utente
        user.deleted = 1

        # Conferma le modifiche
        db.session.commit()
        
        return jsonify({"message": "Utente cancellato con successo"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def delete_user_orders(id_user, id_user_to_delete):
    # Placeholder: qui si dovrebbe implementare la logica per eliminare gli ordini associati all'utente
    try:
        reservations_to_delete = Reservation.query.filter(
            Reservation.booker == id_user_to_delete,
            Reservation.bookStatus.in_(['PENDENT', 'ACCEPTED'])  # Usa .in_ per controllare più valori
        ).all()

        for reservation in reservations_to_delete:
            reservation.bookStatus = 'DELETED'
            reservation.note = (reservation.note or "") + f" | USER DELETED by idUser {id_user}"  # Gestisci note nulle
            db.session.commit()  # Commit per ogni prenotazione, più sicuro in caso di errori

        return f"{len(reservations_to_delete)} prenotazioni eliminate per l'utente {id_user_to_delete}"

    except Exception as e:
        db.session.rollback()  # Rollback in caso di errore
        return f"Errore durante l'eliminazione delle prenotazioni: {str(e)}"
