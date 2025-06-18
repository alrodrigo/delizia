import { axiosInstance } from './authService';

const API_ENDPOINT = '/evaluaciones';

const desempenoService = {
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
      console.log('🔍 Obteniendo evaluación con ID:', id);
      // Añadir timestamp para evitar caché
      const timestamp = new Date().getTime();
      const response = await axiosInstance.get(API_ENDPOINT, { 
        params: { id, _t: timestamp } 
      });
      console.log('📊 Datos de evaluación recibidos de la API:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error obteniendo evaluación:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  getByEmpleado: async (empleadoId) => {
    try {
      console.log('📊 Buscando evaluaciones para empleado:', empleadoId);
      // Usar el parámetro empleado que espera la API
      const response = await axiosInstance.get(API_ENDPOINT, { 
        params: { empleado: empleadoId } 
      });
      console.log('📊 Respuesta de evaluaciones:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en getByEmpleado:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  create: async (desempeno) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT, desempeno);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  update: async (id, desempeno) => {
    try {
      console.log('🔄 Actualizando evaluación:', id, desempeno);
      const response = await axiosInstance.put(API_ENDPOINT, desempeno, {
        params: { id }
      });
      console.log('✅ Respuesta actualización evaluación:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando evaluación:', error);
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

export default desempenoService;
