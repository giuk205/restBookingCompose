from flask import Blueprint, jsonify
from models.user import User

data_bp = Blueprint('data', __name__)

@data_bp.route('/data')
def get_data():
    try:
        # Recupera tutti gli utenti dalla tabella 'user'
        users = User.query.all()
        result = []
        for user in users:
            result.append({
                'id': user.idUser,
                'username': user.name,
                'email': user.email
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
