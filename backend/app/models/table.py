from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Table(db.Model):
    __tablename__ = 'table'

    idTable = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tableName = db.Column(db.String(100), nullable=False)  # Aggiunta lunghezza stringa
    seatNumber = db.Column(db.SmallInteger, nullable=False, default=1)

    def __repr__(self):
        return f'<Table {self.tableName} (Seats: {self.seatNumber})>'
