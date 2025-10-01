import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDropbox } from 'react-icons/fa';
import { api } from '../services/api';
import AuthCodeInput from './AuthCodeInput';

const DropboxLogin = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(false);

  useEffect(() => {
    // Al cargar el componente, obtener la URL de autenticación
    const getAuthUrl = async () => {
      setIsLoading(true);
      try {
        const response = await api.getAuthUrl();
        console.log('Respuesta de getAuthUrl:', response);
        if (response.auth_url) {
          setAuthUrl(response.auth_url);
        }
      } catch (err) {
        console.error('Error al obtener URL de autenticación:', err);
        setError('Error al conectar con el servidor. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    getAuthUrl();
  }, []);

  const handleLogin = () => {
    // Mostrar directamente el componente de entrada de código
    setShowAuthInput(true);
  };
  
  const handleAuthSuccess = () => {
    onLogin();
  };
  
  const handleCancel = () => {
    setShowAuthInput(false);
  };

  // Mostrar el componente AuthCodeInput si el usuario ha hecho clic en el botón
  if (showAuthInput) {
    return <AuthCodeInput 
      authUrl={authUrl} 
      onSuccess={handleAuthSuccess} 
      onCancel={handleCancel} 
    />;
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaDropbox className="text-6xl text-blue-600 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar sesión en Dropbox</h2>
      
      <p className="text-gray-600 mb-8 text-center">
        Para utilizar esta aplicación, necesitas conectar tu cuenta de Dropbox.
      </p>
      
      {error && (
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      
      <motion.button
        className={`w-full py-3 px-6 rounded-md text-white font-medium ${
          isLoading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'
        } transition-colors duration-300 flex items-center justify-center`}
        onClick={handleLogin}
        disabled={isLoading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <FaDropbox className="mr-2" />
            Conectar con Dropbox
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default DropboxLogin;