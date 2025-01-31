from flask import Blueprint, request, jsonify
from datetime import datetime
from models.table import Table
from models.reservation import Reservation
from mydb import miodb as db

booked_bp = Blueprint('booked', __name__)

@booked_bp.route('/booked', methods=['GET'])
def get_booked():
    date_str = request.args.get('month', type=str, default=None)
    if not date_str:
        # Se il parametro 'month' non è presente, usa la data corrente
        input_date = datetime.utcnow()
    else:
        try:
            # Formato del parametro "YYYY-MM-DD"
            input_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Expected format: YYYY-MM-DD."}), 400


    # Ignoriamo il giorno, ma manteniamo il mese e l'anno
    month = input_date.month
    current_year = input_date.year

    start_date = datetime(current_year, month, 1)
    next_month = month + 1 if month < 12 else 1
    next_year = current_year if month < 12 else current_year + 1
    end_date = datetime(next_year, next_month, 1)

    # Tavoli che sono disponibili almeno un giorno nel mese richiesto
    available_tables = Table.query.filter(
        (Table.availableFrom <= end_date) & 
        ((Table.availableUntil >= start_date) | (Table.availableUntil == None))
    ).all()

    # Lista tavoli in formato JSON
    listaTavoli = [
        {
            "idTable": table.idTable,
            "tableName": table.tableName,
            "seatNumber": table.seatNumber,
            "availableFrom": table.availableFrom.isoformat(),
            "availableUntil": table.availableUntil.isoformat() if table.availableUntil else None,
            "updated": table.updated.isoformat()
        }
        for table in available_tables
    ]

    # Prenotazioni valide per il mese specificato
    valid_reservations = Reservation.query.filter(
        Reservation.when >= start_date,
        Reservation.when < end_date,
        Reservation.bookStatus.notin_(['REJECTED', 'DELETED', 'ADMIN_CANCELLED']),
        Reservation.assignedTable.isnot(None)
    ).all()

    booked_data = [
        {
            "idReservation": res.idReservation,
            "booker": res.booker,
            "when": res.when.isoformat(),
            "guests": res.guests,
            "note": res.note,
            "created": res.created.isoformat(),
            "updated": res.updated.isoformat(),
            "bookStatus": res.bookStatus,
            "assignedTable": res.assignedTable,
            "bookedFrom": res.bookedFrom
        }
        for res in valid_reservations 
    ]

    return jsonify({"bookings": booked_data, "tables": listaTavoli})
