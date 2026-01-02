#!/bin/bash
# Script de inicialización de la base de datos

set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

echo "Generating Prisma Client..."
npx prisma generate

echo "Creating database schema..."
# Usar db push para desarrollo (crea tablas directamente desde schema)
# Si hay migraciones, usar migrate deploy (producción)
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "Migrations found, applying..."
  npx prisma migrate deploy
else
  echo "No migrations found, pushing schema..."
  npx prisma db push --accept-data-loss || true
fi

echo "Seeding database..."
npm run db:seed || echo "Seed failed, continuing..."

echo "Database initialization completed!"

