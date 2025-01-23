from datetime import datetime, timezone
from mydb import miodb as db

class User(db.Model):
    __tablename__ = 'user'

    idUser = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    authorizedCode = db.Column(db.SmallInteger, default=0)
    admin = db.Column(db.String(1), nullable=False, default='N')
    adminNote = db.Column(db.String(255))
    staff = db.Column(db.String(1), nullable=False, default='N')
    updateDate = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    def __repr__(self):
        return f'<User {self.name} ({self.email})>'
