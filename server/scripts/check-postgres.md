# Guía para Verificar y Configurar PostgreSQL

## 1. Verificar si PostgreSQL está instalado

### Windows:
```bash
# Verificar si está instalado
psql --version

# Si no está instalado, descarga desde:
# https://www.postgresql.org/download/windows/
```

### Linux (Ubuntu/Debian):
```bash
# Verificar
psql --version

# Si no está instalado:
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Mac:
```bash
# Con Homebrew
brew install postgresql@14
brew services start postgresql@14
```

## 2. Iniciar PostgreSQL

### Windows:
- Busca "Services" en el menú de inicio
- Busca "postgresql" en los servicios
- Haz clic derecho → Start

O desde la línea de comandos:
```bash
# Si instalaste con el instalador oficial
net start postgresql-x64-14
```

### Linux:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Para iniciar automáticamente
```

### Mac:
```bash
brew services start postgresql@14
```

## 3. Verificar que está corriendo

```bash
# Debería responder "accepting connections"
pg_isready -h localhost -p 5432
```

## 4. Crear la base de datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE linked_platform;
\q
```

## 5. Configurar .env

Edita `server/.env` y actualiza DATABASE_URL con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/linked_platform?schema=public"
```

Si no tienes contraseña para postgres:
```env
DATABASE_URL="postgresql://postgres@localhost:5432/linked_platform?schema=public"
```

## 6. Probar la conexión

```bash
cd server
npm run db:migrate
```

