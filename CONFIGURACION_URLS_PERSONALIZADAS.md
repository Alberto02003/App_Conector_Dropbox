# Conector Dropbox - Proyecto Dockerizado

Aplicación completa para conectar con Dropbox, dockerizada para máxima portabilidad y facilidad de despliegue.

## 🐳 Arquitectura Docker

El proyecto está compuesto por dos servicios principales:

- **Backend**: API Flask en Python con Gunicorn
- **Frontend**: Aplicación React/Vite servida con Nginx
- **Orquestación**: Docker Compose con configuración unificada (incluye URLs personalizadas)
- **Red personalizada**: Para comunicación entre servicios
- **Volúmenes persistentes**: Para datos del backend

## 🚀 Inicio Rápido con Docker

### 1. Prerrequisitos
- Docker Desktop instalado
- Docker Compose v3.8 o superior

### 2. Configuración

#### A. Configurar archivo hosts (para URLs personalizadas)
**Windows:**
1. Abre el Bloc de notas como **Administrador**
2. Abre: `C:\Windows\System32\drivers\etc\hosts`
3. Agrega: `127.0.0.1    conector_dropbox`
4. Guarda el archivo

**Linux/Mac:**
```bash
sudo echo "127.0.0.1    conector_dropbox" >> /etc/hosts
```

#### B. Configurar variables de entorno
```bash
# Clonar/descargar el proyecto
cd Dropbox

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Dropbox
# DROPBOX_APP_KEY=tu_app_key
# DROPBOX_APP_SECRET=tu_app_secret
# DROPBOX_ACCESS_TOKEN=tu_access_token
# SECRET_KEY=tu_clave_secreta
```

### 3. Ejecutar
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

### 4. Acceder

#### Con URLs estándar (localhost):
- **Frontend**: http://localhost (puerto 80)
- **Frontend alternativo**: http://localhost:5173
- **Backend API**: http://localhost:5000

#### Con URLs personalizadas (conector_dropbox):
- **Frontend principal**: http://conector_dropbox (puerto 80)
- **Frontend alternativo**: http://conector_dropbox:5173
- **Frontend adicional**: http://conector_dropbox:3000
- **Backend API**: http://conector_dropbox:5000

> **Nota**: Para usar las URLs personalizadas, asegúrate de tener configurado el archivo hosts del sistema.

## 📁 Estructura del Proyecto Dockerizado

```
Dropbox/
├── docker-compose.yml          # Orquestación de servicios

├── .env.example               # Plantilla de variables de entorno
├── .env                       # Variables de entorno (crear)
├── App_Dropbox/              # Frontend React
│   ├── Dockerfile            # Imagen del frontend
│   ├── nginx.conf            # Configuración de Nginx
│   ├── .dockerignore         # Archivos a ignorar
│   └── ...                   # Código fuente React
├── backend/                  # Backend Flask
│   ├── Dockerfile            # Imagen del backend
│   ├── .dockerignore         # Archivos a ignorar
│   └── ...                   # Código fuente Python
└── README.md                 # Este archivo
```

## 🔧 Comandos Docker Útiles

### Gestión de Servicios
```bash
# Iniciar servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Ver logs
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
```

### Desarrollo
```bash
# Ejecutar comandos en contenedores
docker-compose exec backend bash
docker-compose exec frontend sh

# Ver estado de servicios
docker-compose ps

# Reiniciar un servicio
docker-compose restart backend
```

## 🌐 Configuración de Red

Los servicios se comunican a través de una red Docker personalizada:
- **Red**: `dropbox_network` (172.20.0.0/16)
- **Backend**: Accesible como `backend:5000` desde el frontend
- **Frontend**: Proxy reverso configurado para `/api` → `backend:5000`

## 📊 Puertos Expuestos

| Servicio | Puerto Interno | Puerto Host | Descripción |
|----------|----------------|-------------|-------------|
| Frontend | 80 | 80 | Aplicación React (principal) |
| Frontend | 80 | 5173 | Aplicación React (alternativo) |
| Backend | 5000 | 5000 | API Flask |

## 🔒 Variables de Entorno

### Requeridas
```env
DROPBOX_APP_KEY=tu_app_key_de_dropbox
DROPBOX_APP_SECRET=tu_app_secret_de_dropbox
SECRET_KEY=clave_secreta_para_flask_sessions
```

### Opcionales
```env
DROPBOX_ACCESS_TOKEN=token_de_acceso_directo
DROPBOX_REDIRECT_URI=http://localhost:5000/api/auth/callback
FLASK_ENV=production
```

## 🏥 Health Checks

Ambos servicios incluyen health checks automáticos:
- **Backend**: `GET /api/auth/status` cada 30s
- **Frontend**: `GET /` cada 30s

## 💾 Volúmenes Persistentes

- **backend_data**: Almacena datos persistentes del backend
- **sessions.json**: Montado para persistir sesiones de autenticación

## 🔧 Configuración Avanzada

### 📋 Configuraciones Avanzadas

#### Docker Compose Unificado
El archivo `docker-compose.yml` incluye toda la configuración necesaria para URLs personalizadas y estándar en un solo archivo.

### Nginx (Frontend)
- Configuración SPA con fallback a `index.html`
- Proxy reverso para `/api` → backend
- Compresión gzip habilitada
- Headers de seguridad configurados
- Cache optimizado para assets estáticos

### Gunicorn (Backend)
- 4 workers por defecto
- Timeout de 120 segundos
- Bind a `0.0.0.0:5000`
- Usuario no-root para seguridad

## 🐛 Solución de Problemas

### Los contenedores no inician
```bash
# Verificar logs
docker-compose logs

# Verificar configuración
docker-compose config

# Limpiar y reconstruir
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Error de conexión entre servicios
```bash
# Verificar red
docker network ls
docker network inspect dropbox_dropbox_network

# Verificar conectividad
docker-compose exec frontend ping backend
```

### Problemas con variables de entorno
```bash
# Verificar que .env existe y tiene las variables correctas
cat .env

# Verificar que docker-compose las lee
docker-compose config
```

### Error de permisos
```bash
# En Linux/Mac, verificar permisos de archivos
sudo chown -R $USER:$USER .

# Reconstruir con permisos correctos
docker-compose build --no-cache
```

## 🚀 Despliegue en Producción

### Con Docker Compose
```bash
# Usar archivo de producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Variables de entorno para producción
```env
FLASK_ENV=production
SECRET_KEY=clave_super_secreta_y_larga_para_produccion
DROPBOX_REDIRECT_URI=https://tu-dominio.com/api/auth/callback
```

## 📈 Monitoreo

### Logs
```bash
# Logs en tiempo real
docker-compose logs -f

# Logs de los últimos 100 líneas
docker-compose logs --tail=100
```

### Recursos
```bash
# Uso de recursos
docker stats

# Información de contenedores
docker-compose ps
```

## 🔄 Actualización

```bash
# Parar servicios
docker-compose down

# Actualizar código fuente
git pull  # o actualizar archivos manualmente

# Reconstruir y reiniciar
docker-compose up --build -d
```

## 🆘 Comandos de Emergencia

```bash
# Parar todo y limpiar
docker-compose down -v --remove-orphans

# Limpiar imágenes no utilizadas
docker image prune -f

# Limpiar todo el sistema Docker (¡CUIDADO!)
docker system prune -a --volumes
```

## 📞 Soporte

Si encuentras problemas:

1. **Verifica los logs**: `docker-compose logs`
2. **Revisa la configuración**: `docker-compose config`
3. **Verifica las variables de entorno**: Archivo `.env` completo
4. **Prueba la conectividad**: Entre servicios y hacia Dropbox API
5. **Reconstruye las imágenes**: `docker-compose build --no-cache`

## 🎯 Ventajas de la Versión Dockerizada

- ✅ **Portabilidad**: Funciona en cualquier sistema con Docker
- ✅ **Aislamiento**: Dependencias encapsuladas
- ✅ **Escalabilidad**: Fácil escalado horizontal
- ✅ **Consistencia**: Mismo entorno en desarrollo y producción
- ✅ **Facilidad**: Un comando para ejecutar todo
- ✅ **Seguridad**: Usuarios no-root y red aislada