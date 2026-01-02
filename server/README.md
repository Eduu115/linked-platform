# Linked Platform - Backend API

Backend API desarrollado con Node.js, Express y PostgreSQL (Prisma) para la plataforma Linked Platform.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
cd server
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
DATABASE_URL="postgresql://user:password@localhost:5432/linked_platform?schema=public"
FRONTEND_URL=http://localhost:5173
```

3. **Crear la base de datos:**
```bash
# Opción 1: Usando psql
psql -U postgres
CREATE DATABASE linked_platform;
\q

# Opción 2: Usando createdb (si está disponible)
createdb -U postgres linked_platform

# Opción 3: Usando el script SQL
psql -U postgres -f scripts/create-db.sql
```

4. **Configurar la base de datos completa (recomendado):**
```bash
# Windows
scripts\setup-db.bat

# Linux/Mac
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# O manualmente:
npm run db:migrate    # Crear tablas
npm run db:generate   # Generar cliente Prisma
npm run db:seed       # Poblar con datos de prueba
```

5. **Iniciar el servidor:**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
server/
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   └── seed.js            # Datos iniciales completos
├── scripts/
│   ├── create-db.sql      # Script SQL para crear la DB
│   ├── setup-db.sh        # Script de setup (Linux/Mac)
│   └── setup-db.bat        # Script de setup (Windows)
├── src/
│   ├── config/
│   │   └── database.js    # Configuración de Prisma
│   ├── controllers/       # Controladores de las rutas
│   ├── middleware/        # Middleware personalizado
│   ├── routes/            # Definición de rutas
│   ├── utils/             # Utilidades
│   └── server.js          # Punto de entrada
├── .env.example
├── package.json
└── README.md
```

## 🗄️ Base de Datos

### Modelos

- **User**: Usuarios (admin/client)
- **Project**: Proyectos del portfolio
- **Service**: Servicios ofrecidos
- **Subscription**: Suscripciones de clientes a servicios

### Comandos de Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear nueva migración
npm run db:migrate

# Abrir Prisma Studio (interfaz visual)
npm run db:studio

# Ejecutar seed (poblar con datos de prueba)
npm run db:seed

# Setup completo (migrate + seed)
npm run db:setup
```

## 📊 Datos de Prueba Incluidos

El seed incluye:

- **2 Usuarios:**
  - Admin: `admin@example.com` / `admin123`
  - Cliente: `cliente@example.com` / `cliente123`

- **8 Servicios:**
  - 2 Hosting
  - 2 Cloud Storage
  - 3 Clases (Java, Python, Desarrollo Web)
  - 1 Consultoría

- **6 Proyectos:**
  - E-commerce Platform
  - Dashboard Analytics
  - Mobile App
  - SaaS Platform
  - Portfolio Website
  - API RESTful

- **2 Suscripciones:**
  - Cliente con Hosting con Dominio Custom
  - Cliente con Desarrollo Web

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario actual (requiere auth)
- `PUT /api/users/profile` - Actualizar perfil (requiere auth)
- `GET /api/users` - Obtener todos los usuarios (requiere admin)
- `GET /api/users/:id` - Obtener usuario por ID (requiere admin)

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos (público)
- `GET /api/projects/:id` - Obtener proyecto por ID (público)
- `POST /api/projects` - Crear proyecto (requiere admin)
- `PUT /api/projects/:id` - Actualizar proyecto (requiere admin)
- `DELETE /api/projects/:id` - Eliminar proyecto (requiere admin)

### Servicios
- `GET /api/services` - Obtener todos los servicios (público)
- `GET /api/services/:id` - Obtener servicio por ID (público)
- `POST /api/services` - Crear servicio (requiere admin)
- `PUT /api/services/:id` - Actualizar servicio (requiere admin)
- `DELETE /api/services/:id` - Eliminar servicio (requiere admin)

### Suscripciones
- `GET /api/subscriptions/my-subscriptions` - Obtener suscripciones del usuario (requiere client)
- `POST /api/subscriptions` - Crear suscripción (requiere client)
- `PUT /api/subscriptions/:id/cancel` - Cancelar suscripción (requiere client)
- `GET /api/subscriptions` - Obtener todas las suscripciones (requiere admin)
- `GET /api/subscriptions/:id` - Obtener suscripción por ID (requiere admin)

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <token>
```

## 🔄 Próximos Pasos

- [ ] Añadir tests unitarios e integración
- [ ] Implementar rate limiting
- [ ] Añadir logging más robusto
- [ ] Implementar paginación en los endpoints
- [ ] Añadir filtros y búsqueda
- [ ] Implementar upload de imágenes
