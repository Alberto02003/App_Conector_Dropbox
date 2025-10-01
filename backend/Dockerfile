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

# Instalar dependencias específicas para evitar problemas de compatibilidad
RUN pip install flask==2.0.1 flask-cors==3.0.10 werkzeug==2.0.3 dropbox==11.36.2 python-dotenv==1.0.0 gunicorn==21.2.0

# Copiar código fuente
COPY . .

# Crear directorio para datos persistentes
RUN mkdir -p /app/data && chmod 777 /app/data

# Crear usuario no-root para seguridad
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Exponer puerto
EXPOSE 5000

# Variables de entorno por defecto
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1
ENV FLASK_HOST=0.0.0.0
ENV FLASK_PORT=5000
ENV PYTHONPATH=/app

# Comando de inicio con Python directamente
CMD ["python", "app.py"]