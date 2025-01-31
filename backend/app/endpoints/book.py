from flask import Blueprint, request, jsonify, session
from datetime import datetime
from models.reservation import Reservation
from mydb import miodb as db

book_bp = Blueprint('book', __name__)

# POST: Creazione prenotazione
@book_bp.route('/book', methods=['POST'])
def create_booking():
    data = request.json

    idUser = session.get('idUser')  # Prendiamo l'id dalla sessione, chi effettua la prenotazione
    if not idUser:
        return jsonify({"error": "User not authenticated"}), 401
    requested_idUser = data.get('idUser',idUser)  # Il tavolo va prenotato per questo utente

    when = data.get('when')
    guests = data.get('guests')
    note = data.get('note', '')
    assignedTable = data.get('assignedTable')

    if not when or not guests or not assignedTable:
        return jsonify({"error": "Missing required fields"}), 400

    when_datetime = datetime.strptime(when, "%Y-%m-%d %H:%M:%S")  # Assumi formato corretto

    # Definizione delle fasce orarie (pranzo < 15:00, cena >= 15:00)
    meal_time = "lunch" if when_datetime.hour < 15 else "dinner"

    # Controllo prenotazioni esistenti
    existing_reservation = Reservation.query.filter(
        Reservation.assignedTable == assignedTable,
        Reservation.when >= when_datetime.replace(hour=0, minute=0, second=0),
        Reservation.when < when_datetime.replace(hour=23, minute=59, second=59),
        Reservation.bookStatus.in_(['PENDENT', 'ACCEPTED'])
    ).all()

    # Controlla se esiste già una prenotazione valida per lo stesso pasto
    for res in existing_reservation:
        res_meal_time = "lunch" if res.when.hour < 15 else "dinner"
        if res_meal_time == meal_time:
            return jsonify({"error": "Table is already booked for this meal"}), 409

    # Se l'utente autenticato sta prenotando per un altro, usiamo idUser della sessione
    booked_from = idUser if requested_idUser and requested_idUser != idUser else requested_idUser

    # Creazione prenotazione
    new_reservation = Reservation(
        booker=idUser,
        when=when_datetime,
        guests=guests,
        note=note,
        created=datetime.utcnow(),
        updated=datetime.utcnow(),
        bookStatus="PENDENT",
        assignedTable=assignedTable,
        bookedFrom=booked_from
    )

    db.session.add(new_reservation)
    db.session.commit()

    return jsonify({"message": "Reservation created", "idReservation": new_reservation.idReservation}), 201

# DELETE: Cancellazione prenotazione
@book_bp.route('/book', methods=['DELETE'])
def cancel_booking():
    idReservation = request.args.get('idbook', type=int)
    bookStatus = request.args.get('bookStatus', type=str)
    session_user_id = session.get('idUser')

    # Verifica che i parametri siano presenti
    if not idReservation or not bookStatus:
        return jsonify({"error": "Missing reservation ID or cancellation reason"}), 400
    if not session_user_id:
        return jsonify({"error": "User not authenticated"}), 401

    # Controlla che bookStatus sia valido
    valid_statuses = {"REJECTED", "DELETED", "ADMIN_CANCELLED"}
    if bookStatus not in valid_statuses:
        return jsonify({"error": "Invalid cancellation reason"}), 400

    # Cerca la prenotazione nel DB
    reservation = Reservation.query.get(idReservation)
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404
    if reservation.bookStatus in valid_statuses:
        return jsonify({"error": "Reservation already cancelled"}), 409

    # Aggiorna lo stato della prenotazione con il motivo corretto
    reservation.bookStatus = bookStatus
    reservation.updated = datetime.utcnow()
    reservation.note = (reservation.note or "") + f" | Cancelled by {session_user_id} ({bookStatus})"

    db.session.commit()

    return jsonify({"message": f"Reservation {idReservation} cancelled as {bookStatus}"}), 200
