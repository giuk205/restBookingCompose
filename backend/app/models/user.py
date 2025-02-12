from datetime import datetime, timezone
from mydb import miodb as db

class User(db.Model):
    __tablename__ = 'user'

    idUser = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    authorizedCode = db.Column(db.SmallInteger, default=0, nullable=True)
    privilege = db.Column(db.SmallInteger, nullable=False, default=40)  # 0=Owner, 10=Admin, 20=Manager, 30=Staff, 40=User
    adminNote = db.Column(db.Text)
    updateDate = db.Column(db.DateTime, nullable=False,
        server_default=db.text("CURRENT_TIMESTAMP"), 
        server_onupdate=db.text("CURRENT_TIMESTAMP")  # Assicura l'aggiornamento automatico
    )
    deleted = db.Column(db.Integer, default=0)  # BIT(1) è più simile a un Integer

    def __repr__(self):
        return f'<User {self.name} ({self.email})>'
