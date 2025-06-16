import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la página
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Intentando login con:', credentials);
      const data = await authService.login(credentials);
      console.log('AuthContext: Login exitoso, data:', data);
      const currentUser = authService.getCurrentUser();
      console.log('AuthContext: Usuario actual:', currentUser);
      setUser(currentUser);
      return data;
    } catch (error) {
      console.error('AuthContext: Error en login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    isSupervisor: user?.rol === 'admin' || user?.rol === 'supervisor',
    isSuperUser: user?.id === 1 || user?._id === 1,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
