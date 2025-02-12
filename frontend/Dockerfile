# Usa un'immagine Node.js ufficiale
FROM node:22-alpine 

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json per installare le dipendenze
COPY package.json package-lock.json ./

# Installa le dipendenze
#RUN npm install
# Rimuove file problematici e reinstalla le dipendenze
RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

# Copia tutto il contenuto del progetto
COPY . .

# Costruisci l'app (opzionale, se vuoi usare una build statica)
RUN npm run build

# Espone la porta di sviluppo di Vite
EXPOSE 5173

# Avvia l'applicazione
#CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["npx", "vite", "--host", "0.0.0.0"]

