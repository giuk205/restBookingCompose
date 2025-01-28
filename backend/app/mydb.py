from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import mysql.connector

miodb = SQLAlchemy()

class MyDB:
  def __init__(self, app=None):
    if app is not None:
      self.init_app(app)

  def init_app(self, app):
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@host.docker.internal/tablebook'
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@db:3306/tablebook'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password@mariadb:3306/tablebook'


    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    miodb.init_app(app)

  def initialize_database(self):
    mydb = None
    try:
      # Connessione diretta a MySQL per eseguire lo script
      mydb = mysql.connector.connect(
          #host="localhost",
          #user="root",
          host="mariadb",
          user="user",
          password="password",
          database="tablebook"
      )
      mycursor = mydb.cursor()

      # Controlla se il database esiste
      mycursor.execute("SHOW DATABASES;")
      databases = [db[0] for db in mycursor.fetchall()]
      if "tablebook" not in databases:
        print("Database non trovato. Creazione in corso...")
        with open("default.sql", "r") as f:
            sql = f.read()
            for statement in sql.split(";"):
                if statement.strip():
                    mycursor.execute(statement)
        mydb.commit()
      else:
        print("Database presente.")
    except mysql.connector.Error as err:
      print(f"Error: {err}")
    finally:
      if mydb:
        mydb.close()
@staticmethod
def get_db_connection():
    return miodb.session
