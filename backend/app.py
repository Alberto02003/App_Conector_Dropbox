from flask import Flask, request, jsonify, redirect, session, url_for
from urllib.parse import quote as url_quote
from flask_cors import CORS
import os
import dropbox
import requests
from dropbox.exceptions import AuthError
from dropbox import DropboxOAuth2Flow
from dotenv import load_dotenv
from datetime import datetime
import tempfile
import secrets
import json
from dropbox_auth import get_dropbox_client, save_token, load_token, get_auth_url, finish_auth

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'default_secret_key')
# Configuración del límite de tamaño de archivos (100MB)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024
# Configuración CORS más permisiva para desarrollo
CORS(app, supports_credentials=True, origins=["*"], allow_headers="*", expose_headers="*", methods="*")

# Configuración de Dropbox
DROPBOX_APP_KEY = os.getenv('DROPBOX_APP_KEY')
DROPBOX_APP_SECRET = os.getenv('DROPBOX_APP_SECRET')
DROPBOX_REDIRECT_URI = os.getenv('DROPBOX_REDIRECT_URI', 'http://conector_dropbox:5000/api/auth/callback')
DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

# Usamos la función get_dropbox_client de dropbox_auth.py

# Ruta de prueba para verificar que el servidor está funcionando
@app.route('/')
def index():
    return jsonify({"status": "API running"})

# Ruta alternativa para verificar el estado
@app.route('/status')
def status():
    return jsonify({"status": "API running"})
    
# Ruta para verificar el estado sin prefijo api
@app.route('/auth/status')
def auth_status_alt():
    return auth_status()

@app.route('/api/auth/status')
def auth_status():
    """
    Verifica si hay una sesión activa válida.
    """
    dbx = get_dropbox_client()
    if dbx:
        try:
            # Verificar que el token funciona haciendo una llamada simple
            account_info = dbx.users_get_current_account()
            return jsonify({
                "status": "authenticated", 
                "user": {
                    "name": account_info.name.display_name,
                    "email": account_info.email
                }
            })
        except Exception as e:
            return jsonify({"status": "not_authenticated", "error": str(e)})
    else:
        return jsonify({"status": "not_authenticated"})

@app.route('/api/auth/dropbox')
def dropbox_auth():
    # Usamos la lógica de dropbox_auth.py
    dbx = get_dropbox_client()
    if dbx:
        return jsonify({"status": "authenticated"})
    else:
        auth_url = get_auth_url()
        return jsonify({"status": "not_authenticated", "auth_url": auth_url})

@app.route('/api/auth/finish', methods=['POST'])
def finish_auth_route():
    data = request.json
    auth_code = data.get('code')
    if not auth_code:
        return jsonify({"status": "error", "message": "Código de autorización no proporcionado"}), 400
    
    dbx = finish_auth(auth_code)
    if dbx:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Error al autenticar con Dropbox"}), 400



@app.route('/api/folders', methods=['GET'])
def get_folders():
    try:
        dbx = get_dropbox_client()
        if not dbx:
            return jsonify({"error": "Error de autenticación con Dropbox"}), 401
        
        # Obtener parámetros de paginación
        cursor = request.args.get('cursor')
        limit = int(request.args.get('limit', 100))
        
        # Obtener carpetas
        if cursor:
            result = dbx.files_list_folder_continue(cursor)
        else:
            result = dbx.files_list_folder('', limit=limit)
        
        folders = []
        for entry in result.entries:
            if isinstance(entry, dropbox.files.FolderMetadata):
                folders.append({
                    "id": entry.id,
                    "name": entry.name,
                    "path": entry.path_display
                })
        
        # Preparar respuesta con información de paginación
        response = {
            "folders": folders,
            "has_more": result.has_more
        }
        
        if result.has_more:
            response["cursor"] = result.cursor
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/folders/create', methods=['POST'])
def create_folder():
    try:
        dbx = get_dropbox_client()
        if not dbx:
            return jsonify({"error": "Error de autenticación con Dropbox"}), 401
        
        data = request.json
        folder_name = data.get('folderName')
        
        if not folder_name:
            return jsonify({"error": "Se requiere un nombre para la carpeta"}), 400
        
        # Crear la ruta completa
        folder_path = '/' + folder_name
        
        # Crear la carpeta en Dropbox
        result = dbx.files_create_folder_v2(folder_path)
        
        return jsonify({
            "success": True,
            "message": "Carpeta creada correctamente",
            "path": folder_path,
            "id": result.metadata.id,
            "name": folder_name
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se ha enviado ningún archivo"}), 400
        
        file = request.files['file']
        client_name = request.form.get('clientName', '')
        document_type = request.form.get('documentType', '')
        date_str = request.form.get('date', datetime.now().strftime('%Y-%m-%d'))
        folder_path = request.form.get('folder', '')
        
        if not file or not client_name or not document_type or not folder_path:
            return jsonify({"error": "Faltan datos requeridos"}), 400
        
        # Crear nombre de archivo con formato: Cliente_TipoDocumento_Fecha.extension
        original_filename = file.filename
        file_extension = os.path.splitext(original_filename)[1]
        new_filename = f"{client_name}_{document_type}_{date_str}{file_extension}"
        
        # Guardar archivo temporalmente
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        file.save(temp_file.name)
        temp_file.close()
        
        # Subir a Dropbox
        dbx = get_dropbox_client()
        if not dbx:
            os.unlink(temp_file.name)
            return jsonify({"error": "Error de autenticación con Dropbox"}), 401
        
        dropbox_path = f"{folder_path}/{new_filename}"
        
        with open(temp_file.name, 'rb') as f:
            dbx.files_upload(f.read(), dropbox_path, mode=dropbox.files.WriteMode.overwrite)
        
        # Eliminar archivo temporal
        os.unlink(temp_file.name)
        
        return jsonify({
            "success": True,
            "message": "Archivo subido correctamente",
            "filename": new_filename,
            "path": dropbox_path
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-root', methods=['POST'])
def upload_file_to_root():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se ha enviado ningún archivo"}), 400
        
        file = request.files['file']
        
        if not file or file.filename == '':
            return jsonify({"error": "No se ha seleccionado ningún archivo"}), 400
        
        # Usar el nombre original del archivo
        filename = file.filename
        
        # Guardar archivo temporalmente
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        file.save(temp_file.name)
        temp_file.close()
        
        # Subir a Dropbox en el directorio raíz
        dbx = get_dropbox_client()
        if not dbx:
            os.unlink(temp_file.name)
            return jsonify({"error": "Error de autenticación con Dropbox"}), 401
        
        dropbox_path = f"/{filename}"
        
        with open(temp_file.name, 'rb') as f:
            dbx.files_upload(f.read(), dropbox_path, mode=dropbox.files.WriteMode.overwrite)
        
        # Eliminar archivo temporal
        os.unlink(temp_file.name)
        
        return jsonify({
            "success": True,
            "message": "Archivo subido correctamente al directorio raíz",
            "filename": filename,
            "path": dropbox_path
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)