import axios from 'axios';

const API_URL = 'http://conector_dropbox:5000/api';

export const api = {
  checkAuthStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/status`, { 
        withCredentials: true,
        // Añadir timestamp para evitar caché
        params: { _t: new Date().getTime() }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking auth status:', error);
      throw error;
    }
  },
  
  getAuthUrl: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/dropbox`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      throw error;
    }
  },
  
  finishAuth: async (code) => {
    try {
      const response = await axios.post(`${API_URL}/auth/finish`, { code }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error finishing auth:', error);
      throw error;
    }
  },

  getFolders: async (cursor = null, limit = 100) => {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      
      const response = await axios.get(`${API_URL}/folders`, { 
        params,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  },
  
  createFolder: async (folderName) => {
    try {
      const response = await axios.post(`${API_URL}/folders/create`, { folderName }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },
  
  uploadFile: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  uploadToRoot: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/upload-root`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file to root:', error);
      throw error;
    }
  }
};