# Étape 1 : Build de l'application React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# ⚠️ On supprime la conf par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# ✅ On copie les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# ✅ On copie ta configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
