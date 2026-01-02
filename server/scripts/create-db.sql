-- Script para crear la base de datos
-- Ejecutar como: psql -U postgres -f scripts/create-db.sql

-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE linked_platform'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'linked_platform')\gexec

-- Conectar a la base de datos
\c linked_platform

-- La base de datos está lista para las migraciones de Prisma

