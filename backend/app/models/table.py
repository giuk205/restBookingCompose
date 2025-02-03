from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from mydb import miodb as db

class Table(db.Model):
    __tablename__ = 'table'

    idTable = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tableName = db.Column(db.Text, nullable=True)  
    seatNumber = db.Column(db.SmallInteger, nullable=False)  
    availableFrom = db.Column(db.DateTime, nullable=False)
    availableUntil = db.Column(db.DateTime, nullable=True)
    updated = db.Column(db.DateTime, nullable=False,
        server_default=db.text("CURRENT_TIMESTAMP"), 
        server_onupdate=db.text("CURRENT_TIMESTAMP")  # Assicura l'aggiornamento automatico
    )

    def __repr__(self):
        return f'<Table {self.tableName} (Seats: {self.seatNumber})>'
    