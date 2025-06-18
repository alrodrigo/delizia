import { axiosInstance } from './authService';

const API_ENDPOINT = '/empleados';

const empleadoService = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT, { params });
      
      // El backend devuelve { success, count, data, pagination }
      return {
        data: response.data.data || [],
        count: response.data.count || 0,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error en empleadoService.getAll:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT, { 
        params: { id } 
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  create: async (empleado) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT, empleado);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  update: async (id, empleado) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINT, empleado, {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(API_ENDPOINT, {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default empleadoService;
