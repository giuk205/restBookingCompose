from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import mysql.connector

miodb = SQLAlchemy()

class MyDB:
  def __init__(self, app=None):
    if app is not None:
      self.init_app(app)

  def init_app(self, app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@mariadb:3306/tablebook'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    miodb.init_app(app)

  def setup_database(self):
    # Aspetta che il database MariaDB sia pronto, e verifica o crea il database 'tablebook'.
    import time
    mydb = None
    while True:
        try:
            print("⏳ Tentativo di connessione a MariaDB...")
            mydb = mysql.connector.connect(     # Connessione diretta a MySQL
                host="mariadb",
                user="user",
                password="password"
            )
            print("✅ Connessione a MariaDB riuscita.")
            break
        except mysql.connector.Error as err:
            print(f"⚠️ MariaDB non è pronto: {err}")
            time.sleep(3)


    # Verifica se il database 'tablebook' esiste
    try:
      mycursor = mydb.cursor()
      mycursor.execute("SHOW DATABASES;")      # Controlla se il database esiste
      databases = [db[0] for db in mycursor.fetchall()]
      if "tablebook" not in databases:
        print("⚠️ Database 'tablebook' non trovato!")
        '''
        print("Database non trovato. Creazione in corso...")
        mycursor.execute("CREATE DATABASE tablebook;")
        mydb.database = "tablebook"
        with open("./app/default.sql", "r") as f:
            sql = f.read()
            for statement in sql.split(";"):
                if statement.strip():
                    mycursor.execute(statement)
        mydb.commit()
        '''
      else:
        print("✅ Database 'tablebook' presente.")
    except mysql.connector.Error as err:
      print(f"❌ Errore durante la verifica del database: {err}")
    finally:
      if mydb:
        mydb.close()

@staticmethod
def get_db_connection():
    return miodb.session
