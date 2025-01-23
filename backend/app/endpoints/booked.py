from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app import get_session
from models.reservation import Reservation
from models.table import Table

reservations_bp = Blueprint('booked', __name__)

@reservations_bp.route('/booked', methods=['GET'])
def get_reservations():
    try:
        month = request.args.get('month')
        if not month:
            return jsonify({"error": "Parametro month è richiesto"}), 400
        
        month_date = datetime.strptime(month, '%Y-%m')
        start_date = month_date - timedelta(days=15)
        end_date = month_date + timedelta(days=45)  # 30 giorni del mese + 15 giorni dopo

        # Crea una sessione del database
        db_session = get_session()

        # Recupera le prenotazioni per il periodo specificato
        reservations = db_session.query(Reservation).filter(Reservation.when.between(start_date, end_date)).all()
        reservations_list = [{"id": r.id, "when": r.when} for r in reservations]

        # Recupera i tavoli
        tables = db_session.query(Table).all()
        tables_list = [{"id": t.id, "number": t.number, "seats": t.seats} for t in tables]

        return jsonify({
            "reservations": reservations_list,
            "tables": tables_list
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
