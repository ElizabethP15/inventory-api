FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero para aprovechar caché de capas
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "server.js"]