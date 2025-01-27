import sys
import os
from flask import Flask, request
from flask_cors import CORS
from flask_session import Session
from mydb import MyDB, miodb
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

def get_session():
    with app.app_context():
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=miodb.engine)
        return SessionLocal()

# Importa e registra i blueprint egli endpoint
from app.endpoints.home import home_bp
from app.endpoints.data import data_bp
from app.endpoints.register import register_bp
from app.endpoints.login import login_bp
from app.endpoints.forgot import forgot_bp
from app.endpoints.logout import logout_bp
#from app.endpoints.booked import booked_bp

# Endpoint di test
app.register_blueprint(home_bp)     # Endpoint di test per la connessione a Flask
app.register_blueprint(data_bp)     # Endpoint di test per la connessione al Database
# Endpoint comuni
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(forgot_bp)
app.register_blueprint(logout_bp)
#app.register_blueprint(booked_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
