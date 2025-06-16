import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';

const ProtectedRoute = ({ requireAdmin, requireSupervisor }) => {
  const { user, loading, isAdmin, isSupervisor } = useAuth();
  
  if (loading) {
    // Aquí podrías mostrar un spinner o mensaje de carga
    return <div>Cargando...</div>;
  }
  
  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se requiere ser admin y el usuario no es admin, redirige
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si se requiere ser supervisor y el usuario no es supervisor ni admin, redirige
  if (requireSupervisor && !isSupervisor) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si el usuario está autenticado y tiene los permisos necesarios, muestra el contenido
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;
