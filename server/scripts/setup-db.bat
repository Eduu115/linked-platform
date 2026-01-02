@echo off
REM Script para configurar la base de datos completa en Windows
REM Uso: scripts\setup-db.bat

echo Configurando base de datos...

REM Variables (ajusta según tu configuración)
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo Creando base de datos...
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -f scripts\create-db.sql

echo Ejecutando migraciones...
call npm run db:migrate

echo Poblando base de datos con datos de prueba...
call npm run db:seed

echo Base de datos configurada correctamente!

pause

