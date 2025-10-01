# Conector Dropbox - Frontend

Aplicación React para conectar y gestionar archivos de Dropbox con una interfaz moderna y responsive.

## 🚀 Características

- **Interfaz moderna**: Diseñada con React y Tailwind CSS
- **Gestión de archivos**: Subida, descarga y organización de archivos en Dropbox
- **Autenticación OAuth**: Integración segura con Dropbox API
- **Responsive**: Optimizada para dispositivos móviles y desktop
- **Drag & Drop**: Subida de archivos mediante arrastrar y soltar
- **URL personalizada**: Configurada para usar `conector_dropbox:5173`

## 🛠️ Tecnologías

- **React 19.1.1**: Framework principal
- **Vite 7.1.7**: Herramienta de build y desarrollo
- **Tailwind CSS 3.3.5**: Framework de estilos
- **Axios 1.6.2**: Cliente HTTP para API calls
- **React Dropzone 14.2.3**: Componente para subida de archivos
- **Framer Motion 11.0.3**: Animaciones
- **React Icons 4.12.0**: Iconografía

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
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

## 🚀 Instalación

1. **Clona o descarga el proyecto**
   ```bash
   cd App_Dropbox
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Verifica la configuración**
   - Asegúrate de que el backend esté ejecutándose en `http://conector_dropbox:5000`
   - Verifica que el archivo hosts esté configurado correctamente

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: **http://conector_dropbox:5173**

### Build para Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
App_Dropbox/
├── public/                 # Archivos estáticos
│   ├── logo.svg
│   └── vite.svg
├── src/
│   ├── components/         # Componentes React
│   ├── services/          # Servicios API
│   │   └── api.js         # Configuración de Axios
│   ├── assets/            # Recursos (imágenes, etc.)
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos principales
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada
├── vite.config.js         # Configuración de Vite
├── tailwind.config.js     # Configuración de Tailwind
├── postcss.config.js      # Configuración de PostCSS
└── package.json           # Dependencias y scripts
```

## 🔧 Configuración

### URL de la API
La aplicación está configurada para conectarse al backend en:
```javascript
const API_URL = 'http://conector_dropbox:5000/api';
```

### Vite Server
Configurado para usar la URL personalizada:
```javascript
server: {
  host: 'conector_dropbox',
  port: 5173,
  strictPort: true,
  open: false
}
```

## 🌐 Endpoints de la API

- `GET /api/auth/status` - Verificar estado de autenticación
- `GET /api/auth/dropbox` - Iniciar autenticación OAuth
- `POST /api/auth/finish` - Completar autenticación
- `GET /api/folders` - Obtener carpetas de Dropbox
- `POST /api/folders/create` - Crear nueva carpeta
- `POST /api/upload` - Subir archivo a carpeta específica
- `POST /api/upload-root` - Subir archivo a la raíz

## 🐛 Solución de Problemas

### Error de conexión con el backend
- Verifica que el backend esté ejecutándose en `http://conector_dropbox:5000`
- Confirma que el archivo hosts esté configurado correctamente
- Revisa la consola del navegador para errores CORS

### La aplicación no carga en conector_dropbox:5173
- Verifica la configuración del archivo hosts
- Asegúrate de que no haya otros servicios usando el puerto 5173
- Intenta reiniciar el servidor de desarrollo

### Problemas de autenticación con Dropbox
- Verifica que las credenciales de Dropbox estén configuradas en el backend
- Confirma que la URL de redirección en Dropbox coincida con: `http://conector_dropbox:5000/api/auth/callback`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter para revisar el código

## 🤝 Desarrollo

Para contribuir al proyecto:

1. Asegúrate de seguir las convenciones de código establecidas
2. Ejecuta `npm run lint` antes de hacer commit
3. Prueba la funcionalidad en ambas URLs (localhost y conector_dropbox)
4. Documenta cualquier cambio en la configuración

## 🐳 Docker

### Ejecutar con Docker
```bash
# Desde la raíz del proyecto
docker-compose up --build

# Solo el frontend (requiere backend ejecutándose)
docker-compose up frontend
```

### Dockerfile
El frontend utiliza un Dockerfile multi-stage:
- **Stage 1**: Build con Node.js 18 Alpine
- **Stage 2**: Servir con Nginx Alpine

### Configuración Nginx
- Configurado para SPA (Single Page Application)
- Proxy reverso para `/api` → backend
- Compresión gzip habilitada
- Headers de seguridad configurados

## 📞 Soporte

Si encuentras problemas específicos del frontend:

1. **Verifica la configuración del archivo hosts**: `conector_dropbox` debe resolver a `127.0.0.1`
2. **Revisa la consola del navegador**: Para errores de JavaScript
3. **Verifica la conexión con el backend**: `http://conector_dropbox:5000/api/auth/status`
4. **Limpia la caché del navegador**: Ctrl+F5 o Cmd+Shift+R
5. **Verifica que el backend esté ejecutándose**: En el puerto 5000

### Con Docker
```bash
# Ver logs del frontend
docker-compose logs frontend

# Acceder al contenedor
docker-compose exec frontend sh

# Verificar configuración de Nginx
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

Para más información sobre la configuración del sistema y Docker, consulta el archivo `CONFIGURACION_URLS_PERSONALIZADAS.md` en la raíz del proyecto.
