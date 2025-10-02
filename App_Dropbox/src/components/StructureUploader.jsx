import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiFolderPlus } from 'react-icons/fi';
import { api } from '../services/api';

const StructureUploader = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
  };

  const handleCreateStructure = async () => {
    if (!file) {
      setUploadStatus({
        success: false,
        message: 'Por favor selecciona un archivo JSON'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.createStructure(formData);

      setUploadStatus({
        success: true,
        message: response.message || `Estructura creada: ${response.total_folders} carpetas`,
        details: response.created_folders
      });

      // Limpiar después de 3 segundos
      setTimeout(() => {
        setFile(null);
      }, 3000);
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Error al crear la estructura: ' + (error.response?.data?.error || error.message)
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary-dark mb-3 flex items-center">
        <FiFolderPlus className="mr-2" />
        Crear Estructura de Carpetas
      </h2>

      {!file ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary-light hover:bg-primary/5'
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <FiUpload className={`text-4xl mb-3 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />

            <p className="text-gray-600 font-medium mb-1">
              {isDragActive ? 'Suelta el archivo JSON aquí' : 'Arrastra un archivo JSON'}
            </p>
            <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4 relative"
        >
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <FiX className="text-xl" />
          </button>

          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <FiFile className="text-primary text-xl" />
            </div>

            <div className="overflow-hidden">
              <p className="font-medium text-primary-dark truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateStructure}
            disabled={isUploading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              isUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {isUploading ? 'Creando estructura...' : 'Crear Estructura en Dropbox'}
          </button>
        </motion.div>
      )}

      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg ${
            uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <p className="font-medium">{uploadStatus.message}</p>
          {uploadStatus.details && uploadStatus.details.length > 0 && (
            <div className="mt-2 text-sm">
              <p className="font-medium mb-1">Carpetas creadas:</p>
              <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                {uploadStatus.details.map((folder, index) => (
                  <li key={index} className="truncate">{folder}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-2">Formato del JSON:</p>
        <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
{`{
  "name": "Carpeta Raíz",
  "folders": [
    {
      "name": "Subcarpeta1",
      "folders": []
    },
    {
      "name": "Subcarpeta2",
      "folders": [
        {
          "name": "SubSubCarpeta",
          "folders": []
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default StructureUploader;
