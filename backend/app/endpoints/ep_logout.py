from flask import Blueprint, jsonify, session

logout_bp = Blueprint('logout', __name__)

@logout_bp.route('/logout', methods=['GET'])
def logout():
    if 'idUser' in session:
        session.clear()
        return jsonify({"message": "Effettuato il logout con successo"}), 200
    else:
        return jsonify({"message": "Non c'è una sessione attiva"}), 400
