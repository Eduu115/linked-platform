#!/bin/bash
# Script de despliegue para producción

set -e

echo "Iniciando despliegue de Linked Platform..."

# Verificar que existe .env
if [ ! -f .env ]; then
    echo "ERROR: Archivo .env no encontrado"
    echo "Copia .env.production.example a .env y configura los valores"
    exit 1
fi

# Verificar que JWT_SECRET esté configurado
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=GENERA" .env; then
    echo "ERROR: JWT_SECRET no está configurado en .env"
    echo "Genera uno usando: openssl rand -base64 32"
    exit 1
fi

# Verificar que las contraseñas no sean las por defecto
if grep -q "DB_PASSWORD=postgres" .env || grep -q "DB_PASSWORD=TU_PASSWORD" .env; then
    echo "ERROR: Debes cambiar DB_PASSWORD en .env"
    exit 1
fi

echo "Construyendo imágenes..."
docker-compose --profile prod build

echo "Deteniendo servicios existentes..."
docker-compose --profile prod down

echo "Iniciando servicios..."
docker-compose --profile prod up -d

echo "Esperando a que los servicios estén listos..."
sleep 10

echo "Verificando estado de los servicios..."
docker-compose --profile prod ps

echo ""
echo "Despliegue completado!"
echo ""
echo "Verifica los logs con: docker-compose --profile prod logs -f"
echo "Verifica el health check: curl http://localhost:3000/api/health"

