import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { api } from '../services/api';

const RootUploader = () => {
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
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await api.uploadToRoot(file);
      setUploadStatus({
        type: 'success',
        message: `Archivo "${result.filename}" subido correctamente al directorio raíz`
      });
      setFile(null);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.error || 'Error al subir el archivo'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary-dark mb-3">Subir Archivo al Directorio Raíz</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-primary">Suelta el archivo aquí...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Arrastra y suelta un archivo aquí, o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              El archivo se subirá directamente al directorio raíz de Dropbox
            </p>
          </div>
        )}
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiFile className="text-primary mr-2" />
              <span className="text-gray-700">{file.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <FiX />
            </button>
          </div>
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center px-4 py-2 rounded-md text-white transition-colors ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Subir al Directorio Raíz
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg flex items-center ${
            uploadStatus.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <FiCheck className="mr-2" />
          ) : (
            <FiX className="mr-2" />
          )}
          {uploadStatus.message}
        </motion.div>
      )}
    </div>
  );
};

export default RootUploader;