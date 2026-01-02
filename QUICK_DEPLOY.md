# Despliegue Rápido - Nginx Proxy Manager + Cloudflare

## Configuración Rápida

### 1. Cloudflare DNS

Agrega estos registros en Cloudflare:

```
Tipo: A
Nombre: @
IP: [TU_IP_PÚBLICA]
Proxy: Activado (nube naranja)

Tipo: A  
Nombre: api
IP: [TU_IP_PÚBLICA]
Proxy: Activado
```

### 2. Archivo .env

Crea `.env` en la raíz del proyecto:

```bash
# Backend
NODE_ENV=production
JWT_SECRET=[GENERA_CON: openssl rand -base64 32]
JWT_EXPIRE=7d
FRONTEND_URL=https://serdrive.com

# Database
DB_USER=postgres
DB_PASSWORD=[PASSWORD_SEGURO]
DB_NAME=linked_platform
DATABASE_URL=postgresql://postgres:[PASSWORD]@postgres:5432/linked_platform?schema=public

# Frontend (usado durante build)
VITE_API_URL=https://serdrive.com/api
```

### 3. Desplegar

```bash
# Construir
docker-compose --profile prod build

# Iniciar
docker-compose --profile prod up -d
```

### 4. Nginx Proxy Manager

#### Frontend (serdrive.com):
- Domain: `serdrive.com`
- Forward: `localhost:80`
- SSL: Solicitar certificado
- Force SSL: ✅

#### Backend (api.serdrive.com):
- Domain: `api.serdrive.com`  
- Forward: `localhost:3000`
- SSL: Mismo certificado
- Force SSL: ✅

**O usar ruta /api:**
- Edita el proxy de `serdrive.com`
- Advanced tab, agrega:
```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 5. Verificar

```bash
# Logs
docker-compose --profile prod logs -f

# Health check
curl http://localhost:3000/api/health
```

**Ver guía completa en [DEPLOY.md](./DEPLOY.md)**

