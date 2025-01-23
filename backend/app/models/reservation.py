from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Reservation(db.Model):
    __tablename__ = 'reservation'

    idReservation = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booker = db.Column(db.Integer, nullable=False)
    when = db.Column(db.DateTime, nullable=False)
    guests = db.Column(db.SmallInteger, nullable=False)
    note = db.Column(db.String(255))  # Specificata lunghezza per migliorare efficienza
    created = db.Column(db.DateTime, nullable=False)
    updated = db.Column(db.DateTime, nullable=False)
    bookStatus = db.Column(db.String(50), nullable=False)
    assignedTable = db.Column(db.Integer)

    def __repr__(self):
        return f'<Reservation {self.idReservation} (Status: {self.bookStatus})>'
