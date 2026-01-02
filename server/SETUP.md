# 🚀 Guía de Configuración Completa

## Paso 1: Instalar PostgreSQL

### Windows
1. Descarga desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación, anota la contraseña del usuario `postgres`
4. Asegúrate de que el servicio se inicie automáticamente

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Mac
```bash
brew install postgresql@14
brew services start postgresql@14
```

## Paso 2: Crear la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE linked_platform;
\q
```

## Paso 3: Configurar Variables de Entorno

```bash
cd server
cp .env.example .env
```

Edita `server/.env` y configura:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/linked_platform?schema=public"
```

**Importante:** Reemplaza `TU_PASSWORD` con la contraseña que configuraste durante la instalación de PostgreSQL.

Si no tienes contraseña (no recomendado):
```env
DATABASE_URL="postgresql://postgres@localhost:5432/linked_platform?schema=public"
```

## Paso 4: Verificar Conexión

```bash
npm run db:check
```

Este comando verificará:
- ✅ Si PostgreSQL está corriendo
- ✅ Si DATABASE_URL está configurada
- ✅ Si puede conectarse a la base de datos
- ✅ Estado actual de los datos

## Paso 5: Configurar la Base de Datos

```bash
# Opción 1: Todo en uno
npm run db:setup

# Opción 2: Paso a paso
npm run db:migrate    # Crear tablas
npm run db:generate   # Generar cliente Prisma
npm run db:seed       # Poblar con datos
```

## Solución de Problemas

### Error: "Can't reach database server"
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica que el puerto 5432 esté disponible
- ✅ Revisa la configuración de DATABASE_URL

### Error: "Authentication failed"
- ✅ Verifica usuario y contraseña en DATABASE_URL
- ✅ Prueba conectarte manualmente: `psql -U postgres`

### Error: "Database does not exist"
- ✅ Crea la base de datos: `CREATE DATABASE linked_platform;`

### Verificar que PostgreSQL está corriendo

**Windows:**
```bash
# En Services (servicios)
# Busca "postgresql" y verifica que esté "Running"
```

**Linux:**
```bash
sudo systemctl status postgresql
```

**Mac:**
```bash
brew services list
```

## Comandos Útiles

```bash
# Verificar conexión
npm run db:check

# Ver base de datos en navegador
npm run db:studio

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status
```

