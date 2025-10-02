import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiPlus, FiTrash2, FiDownload, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { api } from '../services/api';

const FolderNode = ({ folder, onAddSubfolder, onDelete, onRename, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  const handleRename = () => {
    if (name.trim() && name !== folder.name) {
      onRename(folder.id, name);
    }
    setIsEditing(false);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors ${
          level === 0 ? 'bg-blue-100' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-700 hover:text-gray-900"
        >
          {folder.folders?.length > 0 ? (
            isExpanded ? <FiChevronDown /> : <FiChevronRight />
          ) : (
            <div className="w-4" />
          )}
        </button>

        <FiFolder className="text-blue-600" />

        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            autoFocus
          />
        ) : (
          <span
            className="flex-1 cursor-pointer font-medium text-gray-900"
            onDoubleClick={() => setIsEditing(true)}
          >
            {folder.name}
          </span>
        )}

        <button
          onClick={() => onAddSubfolder(folder.id)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Agregar subcarpeta"
        >
          <FiPlus size={16} />
        </button>

        {level > 0 && (
          <button
            onClick={() => onDelete(folder.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Eliminar carpeta"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && folder.folders?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {folder.folders.map((subfolder) => (
              <FolderNode
                key={subfolder.id}
                folder={subfolder}
                onAddSubfolder={onAddSubfolder}
                onDelete={onDelete}
                onRename={onRename}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StructureBuilder = () => {
  const [structure, setStructure] = useState({
    id: 'root',
    name: 'Carpeta Raíz',
    folders: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);

  const findFolderById = (folders, id) => {
    for (let folder of folders) {
      if (folder.id === id) return folder;
      if (folder.folders) {
        const found = findFolderById(folder.folders, id);
        if (found) return found;
      }
    }
    return null;
  };

  const addSubfolder = (parentId) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: 'Nueva Carpeta',
      folders: []
    };

    if (parentId === 'root') {
      setStructure({
        ...structure,
        folders: [...structure.folders, newFolder]
      });
    } else {
      const updateFolders = (folders) => {
        return folders.map((folder) => {
          if (folder.id === parentId) {
            return {
              ...folder,
              folders: [...(folder.folders || []), newFolder]
            };
          }
          if (folder.folders) {
            return {
              ...folder,
              folders: updateFolders(folder.folders)
            };
          }
          return folder;
        });
      };

      setStructure({
        ...structure,
        folders: updateFolders(structure.folders)
      });
    }
  };

  const deleteFolder = (folderId) => {
    const deleteFolderFromTree = (folders) => {
      return folders
        .filter((folder) => folder.id !== folderId)
        .map((folder) => ({
          ...folder,
          folders: folder.folders ? deleteFolderFromTree(folder.folders) : []
        }));
    };

    setStructure({
      ...structure,
      folders: deleteFolderFromTree(structure.folders)
    });
  };

  const renameFolder = (folderId, newName) => {
    if (folderId === 'root') {
      setStructure({ ...structure, name: newName });
      return;
    }

    const renameFolderInTree = (folders) => {
      return folders.map((folder) => {
        if (folder.id === folderId) {
          return { ...folder, name: newName };
        }
        if (folder.folders) {
          return {
            ...folder,
            folders: renameFolderInTree(folder.folders)
          };
        }
        return folder;
      });
    };

    setStructure({
      ...structure,
      folders: renameFolderInTree(structure.folders)
    });
  };

  const downloadJSON = () => {
    const cleanStructure = (folder) => {
      const cleaned = {
        name: folder.name,
        folders: folder.folders?.map(cleanStructure) || []
      };
      return cleaned;
    };

    const jsonData = cleanStructure(structure);
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estructura-carpetas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createStructureInDropbox = async () => {
    setIsCreating(true);
    setCreateStatus(null);

    try {
      // Crear un archivo JSON temporal y enviarlo
      const cleanStructure = (folder) => {
        const cleaned = {
          name: folder.name,
          folders: folder.folders?.map(cleanStructure) || []
        };
        return cleaned;
      };

      const jsonData = cleanStructure(structure);
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: 'application/json'
      });
      const file = new File([blob], 'estructura.json', { type: 'application/json' });

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.createStructure(formData);

      setCreateStatus({
        success: true,
        message: response.message || `Estructura creada: ${response.total_folders} carpetas`,
        details: response.created_folders
      });
    } catch (error) {
      setCreateStatus({
        success: false,
        message: 'Error al crear la estructura: ' + (error.response?.data?.error || error.message)
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetStructure = () => {
    setStructure({
      id: 'root',
      name: 'Carpeta Raíz',
      folders: []
    });
    setCreateStatus(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary-dark mb-3 flex items-center">
        <FiFolder className="mr-2" />
        Constructor de Estructura
      </h2>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[300px]">
        <FolderNode
          folder={structure}
          onAddSubfolder={addSubfolder}
          onDelete={deleteFolder}
          onRename={renameFolder}
        />

        {structure.folders.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>Haz clic en el botón + para agregar carpetas</p>
            <p className="text-sm mt-2">Doble clic en el nombre para editar</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => addSubfolder('root')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiPlus /> Agregar Carpeta
        </button>

        <button
          onClick={downloadJSON}
          disabled={structure.folders.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            structure.folders.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiDownload /> Descargar JSON
        </button>

        <button
          onClick={createStructureInDropbox}
          disabled={structure.folders.length === 0 || isCreating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            structure.folders.length === 0 || isCreating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isCreating ? 'Creando...' : 'Crear en Dropbox'}
        </button>

        <button
          onClick={resetStructure}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiTrash2 /> Limpiar Todo
        </button>
      </div>

      {createStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg ${
            createStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <p className="font-medium">{createStatus.message}</p>
          {createStatus.details && createStatus.details.length > 0 && (
            <div className="mt-2 text-sm">
              <p className="font-medium mb-1">Carpetas creadas:</p>
              <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                {createStatus.details.map((folder, index) => (
                  <li key={index} className="truncate">{folder}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-2">💡 Instrucciones:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Usa el botón <strong>+</strong> verde para agregar subcarpetas</li>
          <li>Haz <strong>doble clic</strong> en el nombre para editar</li>
          <li>Usa el botón <strong>🗑️</strong> rojo para eliminar una carpeta</li>
          <li>Descarga el JSON o crea directamente en Dropbox</li>
        </ul>
      </div>
    </div>
  );
};

export default StructureBuilder;
