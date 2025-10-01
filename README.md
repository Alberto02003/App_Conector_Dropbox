# 🚀 Conector Dropbox - Aplicación Full Stack Dockerizada

Una aplicación web moderna y completa para gestionar archivos de Dropbox con una interfaz intuitiva y una API robusta, completamente dockerizada para facilitar el despliegue.

![Dropbox](https://img.shields.io/badge/Dropbox-0061FF?style=for-the-badge&logo=dropbox&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Descripción

**Conector Dropbox** es una aplicación web full stack que permite a los usuarios conectarse de forma segura a su cuenta de Dropbox y gestionar archivos de manera intuitiva. La aplicación está completamente dockerizada y configurada para usar URLs personalizadas, facilitando tanto el desarrollo como el despliegue en producción.

### ✨ Características Principales

- 🔐 **Autenticación OAuth segura** con Dropbox
- 📁 **Gestión completa de carpetas** (crear, listar, navegar)
- 📤 **Subida de archivos** con drag & drop
- 🎨 **Interfaz moderna y responsive** con Tailwind CSS
- 🐳 **Completamente dockerizada** para fácil despliegue
- 🌐 **URLs personalizadas** (`conector_dropbox`)
- 🔄 **API REST robusta** con Flask
- ⚡ **Frontend optimizado** con React y Vite
- 🔒 **Configuración de seguridad** con usuarios no-root
- 📊 **Health checks** para monitoreo

## 🏗️ Arquitectura

### Backend (Flask + Python)
- **Framework**: Flask 2.0.1 con Gunicorn
- **API**: RESTful con endpoints para autenticación y gestión de archivos
- **Autenticación**: OAuth 2.0 con Dropbox SDK
- **CORS**: Configurado para frontend React
- **Sesiones**: Persistencia de tokens de autenticación

### Frontend (React + Vite)
- **Framework**: React 19.1.1 con Vite 7.1.7
- **Estilos**: Tailwind CSS 3.3.5 para diseño moderno
- **Animaciones**: Framer Motion para transiciones suaves
- **HTTP Client**: Axios para comunicación con API
- **File Upload**: React Dropzone con drag & drop

### Infraestructura Docker
- **Orquestación**: Docker Compose con configuración unificada
- **Red personalizada**: Comunicación entre servicios
- **Volúmenes persistentes**: Datos del backend
- **Multi-stage builds**: Optimización de imágenes
- **Nginx**: Servidor web para frontend en producción

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker Desktop instalado
- Cuenta de desarrollador en Dropbox
- Git (para clonar el repositorio)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Alberto02003/App_Conector_Dropbox.git
cd App_Conector_Dropbox
```

### 2. Configurar Dropbox App
1. Ve a [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Crea una nueva aplicación con "Scoped access"
3. Configura la URL de redirección: `http://conector_dropbox:5000/api/auth/callback`
4. Obtén tu App Key y App Secret

### 3. Configurar Variables de Entorno
```bash
# Copiar plantilla de variables
cp .env.example .env

# Editar .env con tus credenciales
DROPBOX_APP_KEY=tu_app_key_aqui
DROPBOX_APP_SECRET=tu_app_secret_aqui
DROPBOX_ACCESS_TOKEN=tu_access_token_aqui
SECRET_KEY=tu_clave_secreta_para_sesiones
```

### 4. Configurar Archivo Hosts (Opcional - para URLs personalizadas)

**Windows:**
```cmd
# Como Administrador, editar: C:\Windows\System32\drivers\etc\hosts
# Agregar: 127.0.0.1    conector_dropbox
```

**Linux/Mac:**
```bash
sudo echo "127.0.0.1    conector_dropbox" >> /etc/hosts
```

### 5. Ejecutar la Aplicación
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

### 6. Acceder a la Aplicación

#### Con URLs personalizadas (recomendado):
- **Frontend**: http://conector_dropbox
- **Frontend alternativo**: http://conector_dropbox:5173
- **API Backend**: http://conector_dropbox:5000

#### Con URLs estándar:
- **Frontend**: http://localhost
- **API Backend**: http://localhost:5000

## 📁 Estructura del Proyecto

```
App_Conector_Dropbox/
├── 📁 App_Dropbox/              # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/       # Componentes React
│   │   │   ├── DropboxLogin.jsx # Autenticación
│   │   │   ├── FileUploader.jsx # Subida de archivos
│   │   │   ├── FolderSelector.jsx # Navegación de carpetas
│   │   │   └── ...
│   │   ├── 📁 services/         # Servicios API
│   │   └── App.jsx              # Componente principal
│   ├── Dockerfile               # Imagen Docker frontend
│   ├── nginx.conf               # Configuración Nginx
│   └── package.json             # Dependencias Node.js
├── 📁 backend/                  # Backend Flask
│   ├── app.py                   # Aplicación principal
│   ├── dropbox_auth.py          # Módulo autenticación
│   ├── Dockerfile               # Imagen Docker backend
│   └── requirements.txt         # Dependencias Python
├── docker-compose.yml           # Orquestación servicios
├── .env.example                 # Plantilla variables entorno
└── README.md                    # Este archivo
```

## 🌐 API Endpoints

### Autenticación
- `GET /api/auth/status` - Verificar estado de autenticación
- `GET /api/auth/dropbox` - Iniciar proceso OAuth
- `POST /api/auth/finish` - Completar autenticación

### Gestión de Carpetas
- `GET /api/folders` - Listar carpetas y archivos
- `POST /api/folders/create` - Crear nueva carpeta

### Gestión de Archivos
- `POST /api/upload` - Subir archivo a carpeta específica
- `POST /api/upload-root` - Subir archivo a la raíz

## 🛠️ Comandos Útiles

### Docker
```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend

# Acceder al contenedor del backend
docker-compose exec backend bash

# Acceder al contenedor del frontend
docker-compose exec frontend sh

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

### Desarrollo
```bash
# Modo desarrollo (sin Docker)
cd backend && python app.py
cd App_Dropbox && npm run dev
```

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Requerida | Ejemplo |
|----------|-------------|-----------|---------|
| `DROPBOX_APP_KEY` | Clave de aplicación Dropbox | ✅ | `abc123def456` |
| `DROPBOX_APP_SECRET` | Secreto de aplicación Dropbox | ✅ | `xyz789uvw012` |
| `DROPBOX_ACCESS_TOKEN` | Token de acceso directo | ❌ | `sl.xxx...` |
| `SECRET_KEY` | Clave secreta para sesiones | ✅ | `mi_clave_super_secreta` |
| `FLASK_ENV` | Entorno de Flask | ❌ | `production` |

### Puertos Configurados
- **80**: Frontend principal (Nginx)
- **5173**: Frontend alternativo
- **3000**: Frontend adicional
- **5000**: Backend API (Flask)

### Red Docker
- **Nombre**: `dropbox_network`
- **Tipo**: Bridge
- **Subnet**: `172.20.0.0/16`

## 🐛 Solución de Problemas

### Error de conexión entre servicios
```bash
# Verificar que los servicios estén ejecutándose
docker-compose ps

# Verificar logs para errores
docker-compose logs
```

### Problemas con URLs personalizadas
```bash
# Verificar configuración de hosts
ping conector_dropbox

# Debe responder desde 127.0.0.1
```

### Error de autenticación Dropbox
1. Verificar credenciales en `.env`
2. Confirmar URL de redirección en Dropbox App Console
3. Revisar logs del backend: `docker-compose logs backend`

### Frontend no carga
```bash
# Verificar que Nginx esté sirviendo archivos
docker-compose exec frontend ls -la /usr/share/nginx/html

# Verificar configuración de Nginx
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

## 🚀 Despliegue en Producción

### Consideraciones de Seguridad
- Cambiar `SECRET_KEY` por una clave robusta
- Usar HTTPS en producción
- Configurar firewall apropiado
- Revisar logs regularmente

### Optimizaciones
- Usar `docker-compose.prod.yml` para producción
- Configurar reverse proxy (Nginx/Traefik)
- Implementar monitoreo (Prometheus/Grafana)
- Configurar backups de volúmenes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Consulta la documentación específica:
   - [Frontend README](./App_Dropbox/README.md)
   - [Backend README](./backend/README.md)
   - [Configuración Docker](./CONFIGURACION_URLS_PERSONALIZADAS.md)
3. Abre un issue en GitHub

## 🎯 Roadmap

- [ ] Implementar descarga de archivos
- [ ] Agregar vista previa de imágenes
- [ ] Implementar búsqueda de archivos
- [ ] Agregar compartir archivos
- [ ] Implementar sincronización en tiempo real
- [ ] Agregar tests automatizados
- [ ] Implementar CI/CD

---

**Desarrollado con ❤️ usando React, Flask y Docker**