import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDropbox } from 'react-icons/fa';
import { api } from '../services/api';

const AuthCodeInput = ({ authUrl, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Asegurarse de que el componente se renderice
  useEffect(() => {
    console.log('AuthCodeInput renderizado con URL:', authUrl);
  }, [authUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Por favor ingresa el código de autorización');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.finishAuth(code);
      if (response.status === 'success') {
        onSuccess();
      } else {
        setError('Código inválido. Por favor intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en finishAuth:', err);
      setError('Error al procesar el código. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaDropbox className="text-6xl text-blue-600 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Autorización de Dropbox</h2>
      
      <p className="text-gray-600 mb-4 text-center">
        1. Haz clic en el botón para abrir Dropbox en una nueva ventana
      </p>
      
      <motion.button
        onClick={() => window.open(authUrl, '_blank')}
        className="w-full py-3 px-6 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors mb-6 text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Abrir Dropbox
      </motion.button>
      
      <p className="text-gray-600 mb-4 text-center">
        2. Autoriza la aplicación y copia el código que te proporciona Dropbox
      </p>
      
      <form onSubmit={handleSubmit} className="w-full">
        {error && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
        
        <div className="mb-4">
          <label htmlFor="code" className="block text-gray-700 mb-2">
            Código de autorización:
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black input-field"
            placeholder="Ingresa el código aquí"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex space-x-4">
          <motion.button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-md text-gray-700 font-medium bg-gray-200 hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            Cancelar
          </motion.button>
          
          <motion.button
            type="submit"
            className="flex-1 py-3 px-6 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AuthCodeInput;