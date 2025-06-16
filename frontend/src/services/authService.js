import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = 'delizia_token';

console.log('API_URL:', API_URL); // Debug log

// Crear una instancia de axios con configuración común
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Interceptor para añadir el token a las cabeceras
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const authService = {
  login: async (credentials) => {
    try {
      console.log('Intentando login en:', `${API_URL}/auth/login`);
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error.response ? error.response.data : error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/registro', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getAdminUsers: async () => {
    try {
      const response = await axiosInstance.get('/auth/usuarios/admin');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios administradores:', error);
      return { data: [] };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getCurrentUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      
      return decoded;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.rol === 'admin';
  },

  isSupervisor: () => {
    const user = authService.getCurrentUser();
    return user && (user.rol === 'admin' || user.rol === 'supervisor');
  }
};

export default authService;
export { axiosInstance };
