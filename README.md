# Linked Platform

Una plataforma web tipo portfolio profesional minimalista y premium, diseñada para centralizar proyectos y servicios como desarrollador.

## 🚀 Inicio Rápido con Docker (Recomendado)

### Prerrequisitos
- Docker Desktop instalado
- Docker Compose v3.8+

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

La base de datos se inicializa automáticamente con datos de prueba.

### Producción

```bash
docker-compose --profile prod up --build -d
```

📖 **Ver [DOCKER.md](./DOCKER.md) para más detalles sobre Docker**

## 🛠️ Instalación Manual (Sin Docker)

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env
# Configura DATABASE_URL en .env
npm run db:migrate
npm run db:seed
npm run dev
```

📖 **Ver [server/README.md](./server/README.md) para más detalles del backend**

## ✨ Características

- 🎨 **Diseño Premium Minimalista** - Estética limpia y elegante
- 📱 **Totalmente Responsive** - Mobile-first
- ⚡ **Rendimiento Optimizado** - Vite + React
- 🎭 **Animaciones Suaves** - Framer Motion
- 🧩 **Arquitectura Modular** - Componentes reutilizables
- 🔐 **Sistema de Autenticación** - JWT con roles (Admin/Cliente)
- 🗄️ **Base de Datos PostgreSQL** - Con Prisma ORM
- 🐳 **Dockerizado** - Fácil despliegue

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Routing
- **Framer Motion** - Animaciones

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **JWT** - Autenticación

## 📁 Estructura del Proyecto

```
linked-platform/
├── server/              # Backend API
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── src/                 # Frontend React
│   ├── components/
│   ├── pages/
│   └── contexts/
├── docker-compose.yml   # Docker Compose
└── Dockerfile.frontend  # Frontend Docker
```

## 🔑 Credenciales de Prueba

- **Admin**: `admin@example.com` / `admin123`
- **Cliente**: `cliente@example.com` / `cliente123`

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
