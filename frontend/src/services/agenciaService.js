import { axiosInstance } from './authService';

const API_ENDPOINT = '/agencias';

const agenciaService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getDefaultAgencia: () => {
    const defaultAgencia = localStorage.getItem('agenciaPredeterminada');
    return defaultAgencia;
  },
  
  setDefaultAgencia: (agenciaId) => {
    localStorage.setItem('agenciaPredeterminada', agenciaId);
  },
  
  create: async (agencia) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT, agencia);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  update: async (id, agencia) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, agencia);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default agenciaService;
