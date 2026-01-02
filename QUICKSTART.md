# 🚀 Inicio Rápido con Docker

## Iniciar Todo el Proyecto

```bash
# Desarrollo (recomendado para empezar)
docker-compose --profile dev up --build

# O usando Make (si tienes make instalado)
make dev
```

Esto iniciará automáticamente:
- ✅ PostgreSQL con la base de datos creada
- ✅ Backend API en http://localhost:3000
- ✅ Frontend en http://localhost:5173
- ✅ Base de datos poblada con datos de prueba

## Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Credenciales de Prueba

- **Admin**: `admin@example.com` / `admin123`
- **Cliente**: `cliente@example.com` / `cliente123`

## Comandos Útiles

```bash
# Ver logs
docker-compose --profile dev logs -f

# Detener servicios
docker-compose --profile dev down

# Reiniciar un servicio
docker-compose --profile dev restart backend

# Acceder a la base de datos
docker-compose --profile dev exec postgres psql -U postgres -d linked_platform
```

## Usando Make (Opcional)

Si tienes `make` instalado, puedes usar comandos más cortos:

```bash
make dev          # Iniciar desarrollo
make logs         # Ver logs
make down         # Detener servicios
make shell-backend # Abrir shell en backend
make db-studio    # Abrir Prisma Studio
```

Ver todos los comandos: `make help`

