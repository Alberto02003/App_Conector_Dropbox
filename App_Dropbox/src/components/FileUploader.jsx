import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

const FileUploader = ({ onFileSelect, file }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary-dark mb-3">Subir Documento</h2>
      
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
              {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo PDF o Word'}
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
          
          <div className="flex items-center">
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
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;