# Dockerfile para Backend Flask - Conector Dropbox
FROM python:3.10-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Exponer puerto
EXPOSE 5000

# Variables de entorno por defecto
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Comando de inicio con Python directamente
CMD ["python", "app.py"]