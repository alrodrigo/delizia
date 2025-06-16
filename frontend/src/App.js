import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Contexto de autenticación
import { AuthProvider } from './contexts/AuthContext';

// Componente de ruta protegida
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas de autenticación
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';

// Página de dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Páginas de empleados
import ListaEmpleados from './pages/empleados/ListaEmpleados';
import FormularioEmpleado from './pages/empleados/FormularioEmpleado';

// Páginas de agencias
import ListaAgencias from './pages/agencias/ListaAgencias';
import FormularioAgencia from './pages/agencias/FormularioAgencia';

// Páginas de empleados detalladas
import PerfilEmpleado from './pages/empleados/PerfilEmpleado';
import DesempenoEmpleado from './pages/empleados/DesempenoEmpleado';
import ObservacionesEmpleado from './pages/empleados/ObservacionesEmpleado';

// Páginas de desempeño
import ListaDesempeno from './pages/desempeno/ListaDesempeno';
import FormularioDesempeno from './pages/desempeno/FormularioDesempeno';

// Páginas de observaciones
import ListaObservaciones from './pages/observaciones/ListaObservaciones';
import FormularioObservacion from './pages/observaciones/FormularioObservacion';
import SystemStatus from './components/debug/SystemStatus';

// Páginas de asistencias
import ListaAsistencias from './pages/asistencias/ListaAsistencias';
import FormularioAsistencia from './pages/asistencias/FormularioAsistencia';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rutas para empleados */}
              <Route path="/empleados" element={<ListaEmpleados />} />
              <Route path="/empleados/nuevo" element={<FormularioEmpleado />} />
              <Route path="/empleados/editar/:id" element={<FormularioEmpleado />} />
              
              {/* Rutas para agencias */}
              <Route path="/agencias" element={<ListaAgencias />} />
              <Route path="/agencias/nueva" element={<FormularioAgencia />} />
              <Route path="/agencias/editar/:id" element={<FormularioAgencia />} />
              
              {/* Rutas para desempeño */}
              <Route path="/desempeno" element={<ListaDesempeno />} />
              <Route path="/desempeno/nuevo" element={<FormularioDesempeno />} />
              <Route path="/desempeno/editar/:id" element={<FormularioDesempeno />} />
              
              {/* Rutas para observaciones */}
              <Route path="/observaciones" element={<ListaObservaciones />} />
              <Route path="/observaciones/nueva" element={<FormularioObservacion />} />
              <Route path="/observaciones/editar/:id" element={<FormularioObservacion />} />
              
              {/* Rutas para asistencias */}
              <Route path="/asistencias" element={<ListaAsistencias />} />
              <Route path="/asistencias/nueva" element={<FormularioAsistencia />} />
              <Route path="/asistencias/editar/:id" element={<FormularioAsistencia />} />
              
              {/* Rutas específicas de empleados */}
              <Route path="/empleados/:id/perfil" element={<PerfilEmpleado />} />
              <Route path="/empleados/:id/desempeno" element={<DesempenoEmpleado />} />
              <Route path="/empleados/:id/observaciones" element={<ObservacionesEmpleado />} />
              
              {/* Ruta de diagnóstico */}
              <Route path="/system-status" element={<SystemStatus />} />
            </Route>
            
            {/* Redirigir a dashboard si está autenticado, sino a login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Ruta de 404 - No encontrado */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
