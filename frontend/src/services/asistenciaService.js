import { axiosInstance } from './authService';

const API_ENDPOINT = '/asistencias';

const asistenciaService = {
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
      console.error('Error en asistenciaService.getAll:', error);
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
  
  create: async (asistencia) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT, asistencia);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  update: async (id, asistencia) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINT, asistencia, {
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

export default asistenciaService;
