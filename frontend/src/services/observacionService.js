import { axiosInstance } from './authService';

const API_ENDPOINT = '/observaciones';

const observacionService = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT, { params });
      return {
        data: response.data.data || [],
        count: response.data.count || 0,
        pagination: response.data.pagination
      };
    } catch (error) {
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
      throw error.response ? error.response.data : error;
    }
  },
  
  getByEmpleado: async (empleadoId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT, { 
        params: { empleado: empleadoId } 
      });
      return {
        data: response.data.data || [],
        count: response.data.count || 0,
        pagination: response.data.pagination
      };
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  create: async (observacion) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT, observacion);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  update: async (id, observacion) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINT, observacion, {
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

export default observacionService;
