import sys
import os
from flask import Flask, request
from flask_cors import CORS
from flask_session import Session
from mydb import MyDB, miodb as db
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
# Per esportare la chiave segreta dall'ambiente nel terminale:
# export SECRET_PYTHON_KEY = 'chiave_segreta_sicura'
app.secret_key = os.environ.get('SECRET_PYTHON_KEY', 'my_default_secret_key')
app.config['SESSION_TYPE'] = 'filesystem'

# Inizializza la sessione
Session(app)

# Configura CORS
#CORS(app, supports_credentials=True, origins="http://localhost:3000")
#CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"])
#CORS(app, supports_credentials=True, origins=["*"])
#CORS(app, origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"])
CORS(app, supports_credentials=True, origins="*")
'''
@app.route('/data', methods=['GET', 'OPTIONS'])
def get_data():
    if request.method == 'OPTIONS':
        return '', 204  # Risponde con successo alla preflight request
    return {"message": "CORS abilitato"}
'''
# Inizializza il database
mydb_instance = MyDB(app)
# Setup del database: attende MariaDB e verifica esistenza database
if __name__ == "__main__":
    mydb_instance.setup_database()

# Importa e registra i blueprint egli endpoint
from app.endpoints.ep_home import home_bp
from app.endpoints.ep_data import data_bp
from app.endpoints.ep_register import register_bp
from app.endpoints.ep_login import login_bp
from app.endpoints.ep_forgot import forgot_bp
from app.endpoints.ep_logout import logout_bp
from app.endpoints.ep_user import user_bp
from app.endpoints.ep_booked import booked_bp
from app.endpoints.ep_book import book_bp
from app.endpoints.ep_table import table_bp

# Endpoint di test
app.register_blueprint(home_bp)     # Endpoint di test per la connessione a Flask
app.register_blueprint(data_bp)     # Endpoint di test per la connessione al Database
# Endpoint comuni
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(forgot_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(user_bp)
app.register_blueprint(booked_bp)
app.register_blueprint(book_bp)
app.register_blueprint(table_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
