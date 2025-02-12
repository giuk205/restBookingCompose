from flask import Blueprint, request, jsonify, session
from models.table import Table
from mydb import miodb as db
from datetime import datetime
from endpoints.ep_user import UserType

table_bp = Blueprint('table', __name__)

# GET: Legge tutti i tavoli
@table_bp.route('/table', methods=['GET'])
def get_tables():
    # Verifica che l'utente sia loggato e abbia il ruolo giusto
    privilege = session.get('privilege')
    if privilege is None or privilege > UserType.MANAGER.value:
        print(f'NON AUTORIZZATO, privilege={privilege} (None)', flush=True)  # Stampa None esplicitamente
        return jsonify({"error": "Unauthorized access"}), 403    
    tables = Table.query.all()
    tables_data = [
        {
            "idTable": table.idTable,
            "tableName": table.tableName,
            "seatNumber": table.seatNumber,
            "availableFrom": table.availableFrom.isoformat(),
            "availableUntil": table.availableUntil.isoformat() if table.availableUntil else None
        } for table in tables
    ]
    return jsonify(tables_data)

# POST: Inserisce o modifica un tavolo
@table_bp.route('/table', methods=['POST'])
def create_or_update_table():
    # Verifica che l'utente sia loggato e abbia il ruolo giusto
    privilege = session.get('privilege', 99)
    #print(f'Privilege {privilege} ', flush=True)

    if privilege > UserType.MANAGER.value:
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.json
    table_id = data.get('idTable')  # ID del tavolo, se presente è una modifica, altrimenti una creazione

    # Creazione o modifica del tavolo
    if table_id:
        # Modifica del tavolo esistente
        table = Table.query.get(table_id)
        if not table:
            return jsonify({"error": "Table not found"}), 404
        table.tableName = data.get('tableName', table.tableName)
        table.seatNumber = data.get('seatNumber', table.seatNumber)
        table.availableFrom = data.get('availableFrom', table.availableFrom)
        if 'availableUntil' in data:  # Verifica se la chiave è presente in data
            table.availableUntil = data['availableUntil']
        else:
            table.availableUntil = None  # Imposta availableUntil a None se non presente
    else:
        # Creazione di un nuovo tavolo
        table = Table(
            tableName=data['tableName'],
            seatNumber=data['seatNumber'],
            availableFrom=data['availableFrom'],
            availableUntil=data.get('availableUntil')  # opzionale
        )
        db.session.add(table)

    # Salva i cambiamenti
    db.session.commit()

    return jsonify({"message": "Table created/updated successfully", "idTable": table.idTable}), 201

# DELETE: Elimina un tavolo (o lo rende non disponibile)
@table_bp.route('/table', methods=['DELETE'])
def delete_table():
    # Verifica che l'utente sia loggato e abbia il ruolo giusto
    if not session.get('privilege') or session.get('privilege') > UserType.MANAGER.value:
        return jsonify({"error": "Unauthorized access"}), 403
    
    table_id = request.args.get('idTable')
    if not table_id:
        return jsonify({"error": "Table ID is required"}), 400
    
    # Trova il tavolo da "eliminare"
    table = Table.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404

    # Verifica se il parametro availableUntil è passato, altrimenti usa datetime.utcnow()
    available_until = request.args.get('availableUntil')
    if available_until:
        try:
            # Se viene passato, proviamo a fare il parsing della data
            available_until_datetime = datetime.strptime(available_until, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400
    else:
        # Se non è passato, usiamo la data e ora correnti
        available_until_datetime = datetime.utcnow()

    # Aggiorna la disponibilità del tavolo
    table.availableUntil = available_until_datetime
    
    # Salva i cambiamenti nel DB
    db.session.commit()

    return jsonify({"message": f"Table {table_id} is now marked as unavailable until {available_until_datetime}."}), 200
