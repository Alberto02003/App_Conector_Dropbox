# Conector Dropbox - Backend

API REST desarrollada en Flask para gestionar la integración con Dropbox, incluyendo autenticación OAuth, gestión de archivos y carpetas.

## 🚀 Características

- **API REST**: Endpoints para gestión completa de Dropbox
- **Autenticación OAuth**: Integración segura con Dropbox API
- **Gestión de archivos**: Subida, descarga y organización
- **Gestión de carpetas**: Creación y listado de directorios
- **CORS configurado**: Soporte para frontend React
- **URL personalizada**: Configurada para usar `conector_dropbox:5000`
- **Sesiones persistentes**: Manejo de tokens de autenticación

## 🛠️ Tecnologías

- **Flask 2.0.1**: Framework web principal
- **Flask-CORS 3.0.10**: Manejo de CORS
- **Dropbox SDK 11.36.2**: Integración con Dropbox API
- **Python-dotenv 0.19.1**: Gestión de variables de entorno
- **Gunicorn 20.1.0**: Servidor WSGI para producción

## 📋 Prerrequisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Cuenta de desarrollador en Dropbox
- Configuración del archivo hosts del sistema

## ⚙️ Configuración del Sistema

**IMPORTANTE**: Para que la URL personalizada funcione, debes configurar el archivo hosts:

### Windows
1. Abre el Bloc de notas como **Administrador**
2. Abre: `C:\Windows\System32\drivers\etc\hosts`
3. Agrega: `127.0.0.1    conector_dropbox`
4. Guarda el archivo

### Linux/Mac
1. Edita: `/etc/hosts`
2. Agrega: `127.0.0.1    conector_dropbox`

## 🔑 Configuración de Dropbox

1. **Crear una aplicación en Dropbox**:
   - Ve a [Dropbox App Console](https://www.dropbox.com/developers/apps)
   - Crea una nueva aplicación
   - Selecciona "Scoped access"
   - Elige "Full Dropbox" o "App folder" según tus necesidades

2. **Configurar la URL de redirección**:
   - En la configuración de tu app, agrega: `http://conector_dropbox:5000/api/auth/callback`

3. **Obtener credenciales**:
   - App Key
   - App Secret
   - Access Token (opcional, para acceso directo)

## 🚀 Instalación

1. **Navega al directorio del backend**
   ```bash
   cd backend
   ```

2. **Crea un entorno virtual (recomendado)**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Instala las dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configura las variables de entorno**
   - Copia el archivo `.env.example` a `.env` (si existe)
   - O edita el archivo `.env` existente con tus credenciales:
   ```env
   DROPBOX_APP_KEY=tu_app_key_aqui
   DROPBOX_APP_SECRET=tu_app_secret_aqui
   DROPBOX_ACCESS_TOKEN=tu_access_token_aqui
   DROPBOX_REDIRECT_URI=http://conector_dropbox:5000/api/auth/callback
   SECRET_KEY=tu_clave_secreta_para_sesiones
   ```

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
python app.py
```
El servidor estará disponible en: **http://conector_dropbox:5000**

### Modo Producción (con Gunicorn)
```bash
gunicorn -w 4 -b conector_dropbox:5000 app:app
```

## 📁 Estructura del Proyecto

```
backend/
├── app.py                 # Aplicación principal Flask
├── dropbox_auth.py        # Módulo de autenticación Dropbox
├── requirements.txt       # Dependencias Python
├── .env                   # Variables de entorno (no versionar)
├── sessions.json          # Almacenamiento de sesiones (temporal)
└── __pycache__/          # Cache de Python
```

## 🌐 Endpoints de la API

### Autenticación
- `GET /api/auth/status` - Verificar estado de autenticación
- `GET /api/auth/dropbox` - Iniciar proceso de autenticación OAuth
- `POST /api/auth/finish` - Completar autenticación con código OAuth

### Gestión de Carpetas
- `GET /api/folders` - Listar carpetas y archivos
  - Query params: `cursor` (paginación), `limit` (límite de resultados)
- `POST /api/folders/create` - Crear nueva carpeta
  - Body: `{"folder_name": "nombre_carpeta"}`

### Gestión de Archivos
- `POST /api/upload` - Subir archivo a carpeta específica
  - Form data: `file` (archivo), `folder_path` (ruta de carpeta)
- `POST /api/upload-root` - Subir archivo a la raíz de Dropbox
  - Form data: `file` (archivo)

## 🔧 Configuración Detallada

### Variables de Entorno

| Variable | Descripción | Requerida | Ejemplo |
|----------|-------------|-----------|---------|
| `DROPBOX_APP_KEY` | Clave de aplicación de Dropbox | ✅ | `abc123def456` |
| `DROPBOX_APP_SECRET` | Secreto de aplicación de Dropbox | ✅ | `xyz789uvw012` |
| `DROPBOX_ACCESS_TOKEN` | Token de acceso directo | ❌ | `sl.abc123...` |
| `DROPBOX_REDIRECT_URI` | URL de redirección OAuth | ✅ | `http://conector_dropbox:5000/api/auth/callback` |
| `SECRET_KEY` | Clave secreta para sesiones Flask | ✅ | `mi_clave_super_secreta` |

### CORS
Configurado para permitir requests desde:
- `http://localhost:5173` (desarrollo local)
- `http://localhost:5174` (desarrollo alternativo)
- `http://conector_dropbox:5173` (URL personalizada)
- `http://conector_dropbox:5174` (URL personalizada alternativa)

### Almacenamiento de Sesiones
- Utiliza `sessions.json` para persistir tokens de autenticación
- En producción, considera usar una base de datos o Redis

## 🐛 Solución de Problemas

### Error "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Error de conexión con Dropbox
- Verifica que las credenciales en `.env` sean correctas
- Confirma que la URL de redirección en Dropbox coincida exactamente
- Revisa que el token de acceso no haya expirado

### Error CORS
- Verifica que el frontend esté ejecutándose en una URL permitida
- Confirma la configuración de CORS en `app.py`

### El servidor no inicia en conector_dropbox:5000
- Verifica la configuración del archivo hosts
- Asegúrate de que no haya otros servicios usando el puerto 5000
- Intenta usar `localhost:5000` temporalmente para debug

### Errores de autenticación OAuth
- Verifica que la URL de redirección en Dropbox sea exactamente: `http://conector_dropbox:5000/api/auth/callback`
- Confirma que los permisos de la aplicación Dropbox sean suficientes
- Revisa los logs del servidor para errores específicos

## 📝 Comandos Útiles

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar en modo desarrollo
python app.py

# Ejecutar con Gunicorn (producción)
gunicorn -w 4 -b conector_dropbox:5000 app:app

# Verificar sintaxis Python
python -m py_compile app.py

# Listar dependencias instaladas
pip list

# Generar requirements.txt actualizado
pip freeze > requirements.txt
```

## 🔒 Seguridad

- **Variables de entorno**: Nunca versiones el archivo `.env`
- **Tokens**: Los tokens se almacenan temporalmente en sesiones
- **CORS**: Configurado solo para dominios específicos
- **Validación**: Se validan todos los inputs de usuario

## 🚀 Despliegue

### Desarrollo
```bash
python app.py
```

### Producción
```bash
# Con Gunicorn
gunicorn -w 4 -b conector_dropbox:5000 app:app

# Con variables de entorno específicas
export FLASK_ENV=production
gunicorn -w 4 -b conector_dropbox:5000 app:app
```

## 🐳 Docker

### Ejecutar con Docker
```bash
# Desde la raíz del proyecto
docker-compose up --build

# Solo el backend
docker-compose up backend
```

### Dockerfile
El backend utiliza:
- **Base**: Python 3.10 Slim
- **Servidor**: Gunicorn con 4 workers
- **Usuario**: No-root para seguridad
- **Puerto**: 5000 expuesto

### Variables de Entorno Docker
```env
# En .env (raíz del proyecto)
DROPBOX_APP_KEY=tu_app_key
DROPBOX_APP_SECRET=tu_app_secret
DROPBOX_ACCESS_TOKEN=tu_access_token
SECRET_KEY=tu_clave_secreta
FLASK_ENV=production
```

### Volúmenes
- `backend_data`: Datos persistentes
- `sessions.json`: Sesiones de autenticación

## 📞 Soporte

Si encuentras problemas específicos del backend:

1. **Verifica la configuración del archivo hosts**: `conector_dropbox` debe resolver a `127.0.0.1`
2. **Revisa los logs del servidor**: Para errores específicos de Flask
3. **Verifica las credenciales de Dropbox**: En el archivo `.env`
4. **Prueba la conectividad**: `curl http://conector_dropbox:5000/api/auth/status`
5. **Verifica las dependencias**: `pip list` para ver paquetes instalados

### Con Docker
```bash
# Ver logs del backend
docker-compose logs backend

# Acceder al contenedor
docker-compose exec backend bash

# Verificar variables de entorno
docker-compose exec backend env | grep DROPBOX

# Verificar conectividad a Dropbox
docker-compose exec backend curl -I https://api.dropboxapi.com/2/users/get_current_account
```

Para más información sobre la configuración del sistema y Docker, consulta el archivo `CONFIGURACION_URLS_PERSONALIZADAS.md` en la raíz del proyecto.

## 🤝 Desarrollo

Para contribuir al proyecto:

1. Sigue las convenciones de código Python (PEP 8)
2. Documenta nuevos endpoints en este README
3. Prueba la funcionalidad con ambas URLs (localhost y conector_dropbox)
4. Actualiza `requirements.txt` si agregas nuevas dependencias