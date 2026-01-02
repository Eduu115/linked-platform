FROM node:18-slim

WORKDIR /app

# Instalar dependencias necesarias para Prisma y PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-client \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de los archivos
COPY . .

# Hacer ejecutables los scripts
RUN chmod +x scripts/*.sh 2>/dev/null || true

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]

