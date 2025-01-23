from flask import Flask
from flask_sqlalchemy import SQLAlchemy

miodb = SQLAlchemy()

class MyDB:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:centrostella@host.docker.internal/tablebook'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        miodb.init_app(app)

    @staticmethod
    def get_db_connection():
        return miodb.session
