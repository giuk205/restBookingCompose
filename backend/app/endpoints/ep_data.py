from flask import Blueprint, jsonify, session
from models.user import User

data_bp = Blueprint('data', __name__)

@data_bp.route('/data')
def get_data():
    try:
        idUser = session.get('idUser')
        if not idUser:
            return jsonify({'error': 'Richiesta non autorizzata'}), 403
        # Recupera gli utenti dalla tabella 'user'
        #users = User.query.all()
        privilege = session.get('privilege', 99)

        users = User.query.filter(User.privilege > privilege).all()
        result = []
        for user in users:
            result.append({
                'id': user.idUser,
                'username': user.name,
                'email': user.email,
                'phone': user.phone,
                'privilege': user.privilege,
                'authorizedCode': user.authorizedCode,
                'adminNote': user.adminNote,
                'updateDate': user.updateDate,
                'deleted': int.from_bytes(user.deleted, byteorder='big') if user.deleted else 0 # Converte bytes in int
            })

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
