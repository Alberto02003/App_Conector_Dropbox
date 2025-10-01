import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FileUploader from './components/FileUploader'
import FolderSelector from './components/FolderSelector'
import RootUploader from './components/RootUploader'
import DropboxLogin from './components/DropboxLogin'
import { api } from './services/api'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [file, setFile] = useState(null)
  const [fileInfo, setFileInfo] = useState({
    clientName: '',
    documentType: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [selectedFolder, setSelectedFolder] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar si hay una sesión activa en el backend
        const authStatus = await api.checkAuthStatus()
        
        if (authStatus.status === 'authenticated') {
          setIsAuthenticated(true)
          setUserInfo(authStatus.user)
          console.log('Sesión activa encontrada:', authStatus.user)
        } else {
          setIsAuthenticated(false)
          setUserInfo(null)
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        setIsAuthenticated(false)
        setUserInfo(null)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuthStatus()
  }, [])

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setFileInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder)
  }

  const handleUpload = async () => {
    if (!file || !fileInfo.clientName || !fileInfo.documentType || !selectedFolder) {
      setUploadStatus({
        success: false,
        message: 'Por favor complete todos los campos y seleccione un archivo y carpeta'
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Preparar datos para enviar al backend
      const formData = new FormData()
      formData.append('file', file)
      formData.append('clientName', fileInfo.clientName)
      formData.append('documentType', fileInfo.documentType)
      formData.append('date', fileInfo.date)
      formData.append('folder', selectedFolder)
      
      // Enviar al backend usando el servicio API
      const response = await api.uploadFile(formData)
      
      setUploadStatus({
        success: true,
        message: response.message || 'Archivo subido correctamente a Dropbox'
      })
      
      // Resetear el formulario
      setFile(null)
      setFileInfo({
        clientName: '',
        documentType: '',
        date: new Date().toISOString().split('T')[0]
      })
      setSelectedFolder('')
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Error al subir el archivo: ' + (error.response?.data?.error || error.message)
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full">
      <div className="min-h-screen w-full p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.h1 
            className="text-3xl font-bold text-primary-dark mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Dropbox File Manager
          </motion.h1>
          
          {isAuthenticated && userInfo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Conectado como:</span> {userInfo.name}
                  </p>
                  <p className="text-xs text-green-600">{userInfo.email}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-700">Conectado</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {isCheckingAuth ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : !isAuthenticated ? (
            <DropboxLogin onLogin={async () => {
              // Verificar el estado de autenticación después del login
              try {
                const authStatus = await api.checkAuthStatus()
                if (authStatus.status === 'authenticated') {
                  setIsAuthenticated(true)
                  setUserInfo(authStatus.user)
                }
              } catch (error) {
                console.error('Error al verificar autenticación después del login:', error)
              }
            }} />
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FileUploader 
                onFileSelect={handleFileSelect} 
                file={file}
              />
              
              {file && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="font-medium text-primary-dark mb-3">Información del documento</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del cliente
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={fileInfo.clientName}
                        onChange={handleInfoChange}
                        className="input-field"
                        placeholder="Ingrese el nombre del cliente"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de documento
                      </label>
                      <input
                        type="text"
                        name="documentType"
                        value={fileInfo.documentType}
                        onChange={handleInfoChange}
                        className="input-field"
                        placeholder="Ingrese el tipo de documento"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={fileInfo.date}
                        onChange={handleInfoChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FolderSelector onFolderSelect={handleFolderSelect} selectedFolder={selectedFolder} />
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !file || !selectedFolder}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    isUploading || !file || !selectedFolder
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {isUploading ? 'Subiendo...' : 'Subir a Dropbox'}
                </button>
                
                {uploadStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg ${
                      uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {uploadStatus.message}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1 md:col-span-2"
            >
              <RootUploader />
            </motion.div>
          </div>
          )}
        </div>
      </motion.div>
    </div>
    </div>
  )
}

export default App
