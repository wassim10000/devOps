# Étape 1: Base image
FROM node:20

# Étape 2: Dossier de travail
WORKDIR /app

# Étape 3: Copier package.json & installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4: Copier le reste du code
COPY . .

# Étape 5: Exposer le port
EXPOSE 5000

# Étape 6: Commande de démarrage
CMD ["node", "index.js"]
