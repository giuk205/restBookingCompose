# RestBookingCompose

RestBookingCompose è un sistema di gestione delle prenotazioni per ristoranti, sviluppato utilizzando un'architettura **Docker-based** con backend in **Flask/Python**, frontend in **React/Vite/Tailwind**, e database **MariaDB**.

## 🚀 Funzionalità principali
- **Gestione delle prenotazioni** con verifica delle disponibilità
- **Autenticazione utenti** per clienti e amministratori
- **Interfaccia moderna e reattiva** con Tailwind CSS
- **API REST** per l'integrazione con altri sistemi

## 📦 Tecnologie utilizzate
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** SQLAlchemy e Flask (Python) 
- **Database:** MariaDB
- **Containerizzazione:** Docker + Docker Compose

## 🛠 Installazione e avvio
### 1️⃣ Clona il repository
```sh
git clone https://github.com/tuo-username/restBookingCompose.git
cd restBookingCompose
```

### 2️⃣ Avvia i container Docker
Assicurati di avere **Docker** e **Docker Compose** installati.
```sh
docker-compose up -d
```

### 3️⃣ Accedi all'applicazione
- **Frontend:** `http://localhost:5173/`
- **Backend API:** `http://localhost:5000`
- **Database:** `http://localhost:3306`


## 📝 TODO & Sviluppi futuri
- [ ] Implementare gestione pagamenti online
- [ ] Su un host abilitare invio email


## 📜 Licenza
Questo progetto è distribuito sotto licenza **MIT**.

