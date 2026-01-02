# 🐳 Guía de Docker

Este proyecto está completamente dockerizado. Puedes ejecutar toda la aplicación (frontend, backend y base de datos) con Docker Compose.

## 📋 Prerrequisitos

- Docker Desktop instalado
- Docker Compose v3.8+

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Construir e iniciar todos los servicios
docker-compose --profile dev up --build

# O en segundo plano
docker-compose --profile dev up -d --build
```

Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **Backend API** en `http://localhost:3000`
- **Frontend** en `http://localhost:5173`

### Producción

```bash
# Construir e iniciar en modo producción
docker-compose --profile prod up --build -d
```

## 📝 Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose --profile dev logs -f

# Servicio específico
docker-compose --profile dev logs -f backend
docker-compose --profile dev logs -f frontend
docker-compose --profile dev logs -f postgres
```

### Detener servicios
```bash
docker-compose --profile dev down
```

### Detener y eliminar volúmenes (CUIDADO: borra la base de datos)
```bash
docker-compose --profile dev down -v
```

### Reconstruir un servicio específico
```bash
docker-compose --profile dev up --build backend
```

### Ejecutar comandos en un contenedor
```bash
# Backend
docker-compose --profile dev exec backend sh

# Base de datos
docker-compose --profile dev exec postgres psql -U postgres -d linked_platform
```

### Reiniciar un servicio
```bash
docker-compose --profile dev restart backend
```

## 🔧 Configuración

### Variables de Entorno

Las variables de entorno están configuradas en los archivos `docker-compose.*.yml`. Para desarrollo, puedes crear un archivo `.env` en la raíz del proyecto:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=linked_platform
DB_PORT=5432
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000
```

### Puertos

- **Frontend**: `5173` (dev) / `80` (prod)
- **Backend**: `3000`
- **PostgreSQL**: `5432`

## 🗄️ Base de Datos

La base de datos se inicializa automáticamente cuando el backend inicia por primera vez:
1. Espera a que PostgreSQL esté listo
2. Ejecuta las migraciones
3. Pobla la base de datos con datos de prueba

### Acceder a la base de datos

```bash
# Desde el contenedor
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d linked_platform

# Desde tu máquina (si tienes psql instalado)
psql -h localhost -U postgres -d linked_platform
```

### Backup de la base de datos

```bash
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres linked_platform > backup.sql
```

### Restaurar backup

```bash
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres linked_platform < backup.sql
```

## 🐛 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs de errores
docker-compose --profile dev logs

# Verificar que los puertos no estén en uso
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :5432
```

### La base de datos no se inicializa

```bash
# Ver logs del backend
docker-compose --profile dev logs backend

# Ejecutar migraciones manualmente
docker-compose --profile dev exec backend npm run db:migrate
```

### Reconstruir todo desde cero

```bash
# Detener y eliminar todo
docker-compose --profile dev down -v

# Eliminar imágenes
docker-compose --profile dev down --rmi all

# Reconstruir
docker-compose --profile dev up --build
```

## 📦 Estructura de Docker

```
.
├── docker-compose.yml          # Configuración única con perfiles
├── Dockerfile.frontend         # Frontend (dev)
├── Dockerfile.prod             # Frontend (prod con nginx)
├── nginx.conf                  # Configuración nginx
├── server/
│   ├── Dockerfile              # Backend (prod)
│   ├── Dockerfile.dev          # Backend (dev)
│   └── scripts/
│       ├── init-db.sh          # Inicialización DB
│       └── wait-for-db.sh      # Esperar DB
└── .dockerignore
```

## 📋 Perfiles Disponibles

- **dev**: Desarrollo (frontend, backend-dev, postgres)
- **prod**: Producción (frontend-prod, backend-prod, postgres)

## 🎯 Workflow de Desarrollo

1. **Iniciar servicios:**
   ```bash
   docker-compose --profile dev up
   ```

2. **Desarrollar:** Los cambios en el código se reflejan automáticamente gracias a los volúmenes montados

3. **Ver logs:**
   ```bash
   docker-compose --profile dev logs -f
   ```

4. **Detener:**
   ```bash
   docker-compose --profile dev down
   ```

## 🔐 Credenciales por Defecto

- **PostgreSQL:**
  - User: `postgres`
  - Password: `postgres`
  - Database: `linked_platform`

- **API:**
  - Admin: `admin@example.com` / `admin123`
  - Cliente: `cliente@example.com` / `cliente123`

**⚠️ IMPORTANTE:** Cambia estas credenciales en producción.

