# Dockerfile para Frontend React/Vite - Conector Dropbox

# Etapa 1: Build
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]