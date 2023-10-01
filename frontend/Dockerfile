# Usa un'immagine di base con Node.js
FROM node:18-alpine

# Imposta il percorso di lavoro nel container
WORKDIR /app

# Copia i file di package.json e package-lock.json per installare le dipendenze iniziali
COPY package*.json .

# Esegui l'installazione delle dipendenze
RUN npm install

# Copia il resto del codice sorgente nell'immagine
COPY . .

# Esponi la porta su cui verrà eseguita l'applicazione
EXPOSE 5173

# Definisci il comando di avvio per l'applicativo
CMD ["npm", "run", "dev"]
