# Guía de Despliegue con Nginx Proxy Manager y Cloudflare

Esta guía te ayudará a desplegar la aplicación Linked Platform usando Nginx Proxy Manager y Cloudflare.

## Prerrequisitos

1. Servidor con Docker y Docker Compose instalado
2. Nginx Proxy Manager instalado y corriendo
3. Dominio `serdrive.com` configurado en Cloudflare
4. Acceso SSH al servidor

## Paso 1: Configuración en Cloudflare

### 1.1 Configurar DNS

1. Ve a tu panel de Cloudflare
2. Selecciona el dominio `serdrive.com`
3. Ve a la sección **DNS**
4. Agrega los siguientes registros:

```
Tipo: A
Nombre: @
Contenido: [IP_PÚBLICA_DE_TU_SERVIDOR]
Proxy: Activado (nube naranja)

Tipo: A
Nombre: api
Contenido: [IP_PÚBLICA_DE_TU_SERVIDOR]
Proxy: Activado (nube naranja)
```

**Nota:** Si quieres usar subdominios separados:
- `serdrive.com` → Frontend
- `api.serdrive.com` → Backend

O puedes usar rutas:
- `serdrive.com` → Frontend
- `serdrive.com/api` → Backend (requiere configuración adicional en NPM)

### 1.2 Configuración SSL/TLS

1. Ve a **SSL/TLS** en Cloudflare
2. Configura el modo en **Full (strict)** o **Full**
3. Asegúrate de que **Always Use HTTPS** esté activado

### 1.3 Configuración de Proxy

1. Ve a **Network**
2. Activa **WebSockets** (si es necesario)
3. Configura **HTTP/2** y **HTTP/3 (QUIC)** según prefieras

## Paso 2: Preparar el Servidor

### 2.1 Clonar el Repositorio

```bash
git clone [TU_REPOSITORIO]
cd linked-platform
```

### 2.2 Crear Archivo .env para Producción

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Backend
NODE_ENV=production
PORT=3000
JWT_SECRET=[GENERA_UN_SECRETO_SEGURO_AQUI]
JWT_EXPIRE=7d
DATABASE_URL=postgresql://postgres:[PASSWORD]@postgres:5432/linked_platform?schema=public
FRONTEND_URL=https://serdrive.com

# Database
DB_USER=postgres
DB_PASSWORD=[PASSWORD_SEGURO]
DB_NAME=linked_platform
DB_PORT=5432

# Frontend
VITE_API_URL=https://serdrive.com/api
```

**Importante:** 
- Genera un `JWT_SECRET` seguro: `openssl rand -base64 32`
- Usa una contraseña segura para PostgreSQL
- Ajusta `VITE_API_URL` según tu configuración (puede ser `https://api.serdrive.com` si usas subdominio)

### 2.3 Construir y Levantar los Servicios

```bash
# Construir las imágenes
docker-compose --profile prod build

# Levantar los servicios
docker-compose --profile prod up -d
```

Verifica que todo esté corriendo:

```bash
docker-compose --profile prod ps
```

## Paso 3: Configurar Nginx Proxy Manager

### 3.1 Acceder a Nginx Proxy Manager

1. Accede a tu Nginx Proxy Manager (normalmente en `http://[TU_SERVIDOR]:81`)
2. Inicia sesión con tus credenciales

### 3.2 Configurar Proxy Host para el Frontend

1. Ve a **Proxy Hosts** → **Add Proxy Host**
2. Configura:

**Details:**
- Domain Names: `serdrive.com`
- Scheme: `http`
- Forward Hostname/IP: `localhost` (o el nombre del contenedor `linked-platform-frontend-prod`)
- Forward Port: `80`
- Cache Assets: ✅ Activado
- Block Common Exploits: ✅ Activado
- Websockets Support: ✅ Activado (si es necesario)

**SSL:**
- SSL Certificate: Solicita un nuevo certificado SSL
- Force SSL: ✅ Activado
- HTTP/2 Support: ✅ Activado
- HSTS Enabled: ✅ Activado
- HSTS Subdomains: ✅ Activado (si usas subdominios)

**Advanced:**
```nginx
# Configuración adicional si es necesario
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 3.3 Configurar Proxy Host para el Backend (si usas subdominio)

Si decides usar `api.serdrive.com`:

1. Ve a **Proxy Hosts** → **Add Proxy Host**
2. Configura:

**Details:**
- Domain Names: `api.serdrive.com`
- Scheme: `http`
- Forward Hostname/IP: `localhost` (o `linked-platform-backend-prod`)
- Forward Port: `3000`
- Block Common Exploits: ✅ Activado
- Websockets Support: ✅ Activado

**SSL:**
- SSL Certificate: Usa el mismo certificado o solicita uno nuevo
- Force SSL: ✅ Activado
- HTTP/2 Support: ✅ Activado

**Advanced:**
```nginx
# Headers para CORS y seguridad
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers (si es necesario)
    add_header 'Access-Control-Allow-Origin' 'https://serdrive.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
}
```

### 3.4 Configurar Proxy Host para el Backend (usando ruta /api)

Si prefieres usar `serdrive.com/api` en lugar de un subdominio:

1. Edita el Proxy Host de `serdrive.com`
2. En **Advanced**, agrega:

```nginx
# Proxy para el backend en /api
location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://serdrive.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    
    # Manejar preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://serdrive.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}

# Frontend (SPA)
location / {
    try_files $uri $uri/ /index.html;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Paso 4: Actualizar Variables de Entorno

### 4.1 Actualizar Backend

Edita el archivo `.env` y actualiza:

```bash
FRONTEND_URL=https://serdrive.com
```

Si usas subdominio:
```bash
FRONTEND_URL=https://serdrive.com
# El backend estará en api.serdrive.com
```

### 4.2 Actualizar Frontend

El frontend se construye con `VITE_API_URL`. Si cambias la URL, necesitas reconstruir:

```bash
# Edita .env
VITE_API_URL=https://serdrive.com/api
# O si usas subdominio:
VITE_API_URL=https://api.serdrive.com

# Reconstruir frontend
docker-compose --profile prod build frontend-prod
docker-compose --profile prod up -d frontend-prod
```

## Paso 5: Verificar el Despliegue

### 5.1 Verificar Servicios

```bash
# Ver logs
docker-compose --profile prod logs -f

# Verificar que los servicios estén corriendo
docker-compose --profile prod ps

# Verificar conectividad
curl http://localhost:3000/api/health
curl http://localhost:80
```

### 5.2 Verificar desde el Navegador

1. Visita `https://serdrive.com`
2. Verifica que el frontend carga correctamente
3. Intenta hacer login
4. Verifica que las peticiones API funcionan

### 5.3 Verificar SSL

1. Verifica que el certificado SSL esté activo (candado verde)
2. Prueba `https://serdrive.com` (debe redirigir automáticamente)

## Paso 6: Configuración Adicional

### 6.1 Firewall

Asegúrate de que los puertos estén abiertos:

```bash
# Puertos necesarios
80 (HTTP) - Redirige a 443
443 (HTTPS) - Nginx Proxy Manager
3000 (Backend) - Solo interno, no exponer públicamente
5432 (PostgreSQL) - Solo interno, no exponer públicamente
```

### 6.2 Backup de Base de Datos

Configura backups regulares:

```bash
# Script de backup
docker-compose --profile prod exec postgres pg_dump -U postgres linked_platform > backup_$(date +%Y%m%d).sql
```

### 6.3 Monitoreo

Considera configurar:
- Health checks automáticos
- Logs centralizados
- Alertas de caídas

## Troubleshooting

### Problema: Certificado SSL no se genera

**Solución:**
- Verifica que los DNS estén apuntando correctamente
- Asegúrate de que el puerto 80 esté accesible desde internet
- Espera unos minutos para la propagación DNS

### Problema: CORS errors

**Solución:**
- Verifica que `FRONTEND_URL` en el backend sea correcta
- Asegúrate de que los headers CORS estén configurados en NPM
- Verifica que el backend esté accesible

### Problema: Frontend no carga

**Solución:**
- Verifica que el contenedor del frontend esté corriendo
- Revisa los logs: `docker-compose --profile prod logs frontend-prod`
- Verifica que NPM esté apuntando al puerto correcto

### Problema: API no responde

**Solución:**
- Verifica que el backend esté corriendo
- Revisa los logs: `docker-compose --profile prod logs backend-prod`
- Verifica la configuración de proxy en NPM
- Asegúrate de que `VITE_API_URL` sea correcta

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose --profile prod logs -f

# Reiniciar un servicio
docker-compose --profile prod restart [servicio]

# Reconstruir todo
docker-compose --profile prod down
docker-compose --profile prod build --no-cache
docker-compose --profile prod up -d

# Acceder a la base de datos
docker-compose --profile prod exec postgres psql -U postgres -d linked_platform

# Verificar salud del backend
curl http://localhost:3000/api/health
```

## Seguridad Adicional

1. **Cambiar credenciales por defecto** de PostgreSQL
2. **Usar secrets de Docker** para contraseñas sensibles
3. **Configurar rate limiting** en Nginx Proxy Manager
4. **Habilitar 2FA** en Cloudflare
5. **Configurar backups automáticos** de la base de datos
6. **Monitorear logs** regularmente

