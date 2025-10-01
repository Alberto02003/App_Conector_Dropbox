import dropbox
import os
import json
from datetime import datetime, timedelta

def get_dropbox_client():
    """
    Obtiene un cliente de Dropbox autenticado.
    Primero intenta cargar un token guardado, si no existe o ha expirado, devuelve None.
    """
    token = load_token()
    if token:
        return dropbox.Dropbox(token)
    return None

def get_auth_url():
    """
    Genera la URL de autorización para Dropbox OAuth2 usando PKCE.
    Guarda el code_verifier para usarlo en finish_auth.
    """
    app_key = os.getenv('DROPBOX_APP_KEY')
    
    if not app_key:
        raise ValueError("DROPBOX_APP_KEY debe estar configurado en las variables de entorno")
    
    # Usar PKCE para la autenticación OAuth2
    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        app_key, 
        use_pkce=True, 
        token_access_type='offline'
    )
    auth_url = auth_flow.start()
    
    # Guardar el code_verifier para usarlo en finish_auth
    save_code_verifier(auth_flow.code_verifier)
    
    return auth_url

def finish_auth(auth_code):
    """
    Completa el proceso de autenticación con el código proporcionado por el usuario usando PKCE.
    Usa el code_verifier guardado previamente.
    """
    app_key = os.getenv('DROPBOX_APP_KEY')
    
    if not app_key:
        raise ValueError("DROPBOX_APP_KEY debe estar configurado en las variables de entorno")
    
    # Cargar el code_verifier guardado
    code_verifier = load_code_verifier()
    if not code_verifier:
        raise Exception("No se encontró code_verifier. Debe generar una nueva URL de autorización.")
    
    # Usar PKCE para la autenticación OAuth2 con el code_verifier guardado
    auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
        app_key, 
        use_pkce=True, 
        token_access_type='offline'
    )
    
    # Establecer el code_verifier en el auth_flow
    auth_flow.code_verifier = code_verifier
    
    try:
        oauth_result = auth_flow.finish(auth_code)
        access_token = oauth_result.access_token
        
        # Guardar el token y limpiar el code_verifier
        save_token(access_token)
        clear_code_verifier()
        
        return access_token
    except Exception as e:
        raise Exception(f"Error al completar la autenticación: {str(e)}")

def save_token(token):
    """
    Guarda el token de acceso en sessions.json con timestamp de expiración.
    """
    try:
        session_data = {
            'access_token': token,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(hours=4)).isoformat()
        }
        
        with open('sessions.json', 'w') as f:
            json.dump(session_data, f, indent=2)
            
        print(f"Token guardado en sessions.json")
    except Exception as e:
        print(f"Error al guardar token: {e}")

def load_token():
    """
    Carga el token de acceso desde sessions.json si existe y no ha expirado.
    """
    try:
        if not os.path.exists('sessions.json'):
            return None
            
        with open('sessions.json', 'r') as f:
            session_data = json.load(f)
        
        # Verificar si el token ha expirado
        expires_at = datetime.fromisoformat(session_data['expires_at'])
        if datetime.now() > expires_at:
            print("Token expirado, eliminando sessions.json")
            os.remove('sessions.json')
            return None
        
        print("Token cargado desde sessions.json")
        return session_data['access_token']
        
    except Exception as e:
        print(f"Error al cargar token: {e}")
        return None

def save_code_verifier(code_verifier):
    """
    Guarda el code_verifier temporalmente para el flujo PKCE.
    """
    try:
        verifier_data = {
            'code_verifier': code_verifier,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(minutes=10)).isoformat()  # Expira en 10 minutos
        }
        
        with open('code_verifier.json', 'w') as f:
            json.dump(verifier_data, f, indent=2)
            
        print(f"Code verifier guardado temporalmente")
    except Exception as e:
        print(f"Error al guardar code verifier: {e}")

def load_code_verifier():
    """
    Carga el code_verifier si existe y no ha expirado.
    """
    try:
        if not os.path.exists('code_verifier.json'):
            return None
            
        with open('code_verifier.json', 'r') as f:
            verifier_data = json.load(f)
        
        # Verificar si el code_verifier ha expirado
        expires_at = datetime.fromisoformat(verifier_data['expires_at'])
        if datetime.now() > expires_at:
            print("Code verifier expirado, eliminando archivo")
            os.remove('code_verifier.json')
            return None
        
        return verifier_data['code_verifier']
        
    except Exception as e:
        print(f"Error al cargar code verifier: {e}")
        return None

def clear_code_verifier():
    """
    Elimina el archivo del code_verifier después de usarlo.
    """
    try:
        if os.path.exists('code_verifier.json'):
            os.remove('code_verifier.json')
            print("Code verifier eliminado")
    except Exception as e:
        print(f"Error al eliminar code verifier: {e}")