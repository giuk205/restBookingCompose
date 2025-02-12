# restBookingCompose

version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mariadb
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000" 
    depends_on:
      - backend
    volumes:
      - ./frontend:/app

  mariadb:
    image: mariadb:10.6
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydatabase
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mariadb_data:/var/lib/mysql

volumes:
  mariadb_data:

