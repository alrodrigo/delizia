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
      console.log('🔍 Obteniendo empleado con ID:', id);
      // Añadir timestamp para evitar caché
      const timestamp = new Date().getTime();
      const response = await axiosInstance.get(API_ENDPOINT, { 
        params: { id, _t: timestamp } 
      });
      console.log('👤 Datos del empleado recibidos de la API:', response.data);
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
      console.log('🔄 Actualizando empleado:', id, empleado);
      const response = await axiosInstance.put(API_ENDPOINT, empleado, {
        params: { id }
      });
      console.log('✅ Respuesta actualización:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando empleado:', error);
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
