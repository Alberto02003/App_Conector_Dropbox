import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiFolderPlus, FiX, FiCheck } from 'react-icons/fi';
import { api } from '../services/api';

const FolderSelector = ({ onFolderSelect, selectedFolder }) => {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchFolders = async (nextCursor = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getFolders(nextCursor);
      
      if (nextCursor) {
        setFolders(prev => [...prev, ...response.folders]);
      } else {
        setFolders(response.folders);
      }
      
      setCursor(response.cursor);
      setHasMore(response.has_more);
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
      setError('No se pudieron cargar las carpetas. Por favor, intenta de nuevo.');
      // Usar carpetas de ejemplo como fallback solo si no hay carpetas cargadas
      if (!folders.length) {
        setFolders([
          { id: 'folder1', name: 'Documentos Personales', path: '/Documentos Personales' },
          { id: 'folder2', name: 'Contratos', path: '/Contratos' },
          { id: 'folder3', name: 'Facturas', path: '/Facturas' },
          { id: 'folder4', name: 'Informes', path: '/Informes' },
          { id: 'folder5', name: 'Proyectos', path: '/Proyectos' }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      setIsLoading(true);
      await api.createFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
      // Recargar la lista de carpetas
      await fetchFolders();
    } catch (error) {
      console.error('Error al crear carpeta:', error);
      setError('No se pudo crear la carpeta. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary-dark mb-3">Seleccionar Carpeta</h2>
      
      {isLoading ? (
        <div className="border rounded-lg p-8 flex justify-center items-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-primary/20 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-primary/20 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                  selectedFolder === folder.path ? 'bg-primary/20' : ''
                }`}
                onClick={() => onFolderSelect(folder.path)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    selectedFolder === folder.path ? 'bg-primary/20' : 'bg-gray-100'
                  }`}>
                    <FiFolder className={`text-lg ${
                      selectedFolder === folder.path ? 'text-primary' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      selectedFolder === folder.path ? 'text-primary-dark' : 'text-gray-700'
                    }`}>
                      {folder.name}
                    </p>
                    <p className="text-sm text-gray-500">{folder.path}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {error && (
            <div className="p-3 text-red-600 text-sm">{error}</div>
          )}
          
          {hasMore && (
            <div className="p-3 text-center">
              <button 
                onClick={() => fetchFolders(cursor)}
                className="text-primary hover:text-primary-dark transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 'Cargar más carpetas'}
              </button>
            </div>
          )}
          
          <div className="p-3 bg-gray-50 border-t">
            <AnimatePresence>
              {isCreatingFolder ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Nombre de la carpeta"
                      className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                    <button 
                      onClick={handleCreateFolder}
                      className="p-2 bg-primary text-white rounded-none border-y border-r border-primary hover:bg-primary-dark transition-colors"
                    >
                      <FiCheck />
                    </button>
                    <button 
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderName('');
                      }}
                      className="p-2 bg-gray-200 text-gray-700 rounded-r-md border-y border-r border-gray-300 hover:bg-gray-300 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            
            <button 
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center justify-center w-full py-2 text-primary hover:text-primary-dark transition-colors"
              disabled={isCreatingFolder}
            >
              <FiFolderPlus className="mr-2" />
              <span>Crear nueva carpeta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderSelector;