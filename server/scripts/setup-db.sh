#!/bin/bash

# Script para configurar la base de datos completa
# Uso: ./scripts/setup-db.sh

echo "Configurando base de datos..."

# Variables (ajusta según tu configuración)
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "Creando base de datos..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -f scripts/create-db.sql

echo "Ejecutando migraciones..."
npm run db:migrate

echo "Poblando base de datos con datos de prueba..."
npm run db:seed

echo "Base de datos configurada correctamente!"

