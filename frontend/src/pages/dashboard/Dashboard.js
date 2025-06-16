import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Button,
  Divider
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Business as BusinessIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import empleadoService from '../../services/empleadoService';
import agenciaService from '../../services/agenciaService';
import asistenciaService from '../../services/asistenciaService';
import AgenciaPredeterminada from '../../components/agencias/AgenciaPredeterminada';
import InfoAgencia from '../../components/agencias/InfoAgencia';
import ListaAgenciasResumen from '../../components/agencias/ListaAgenciasResumen';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    empleados: 0,
    agencias: 0,
    asistenciasHoy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de empleados
        const empleadosResponse = await empleadoService.getAll();
        
        // Obtener datos de agencias
        const agenciasResponse = await agenciaService.getAll();
        
        // Obtener asistencias de hoy
        const fecha = new Date().toISOString().split('T')[0];
        const asistenciasResponse = await asistenciaService.getAll({ fecha });
        
        setStats({
          empleados: empleadosResponse.count || 0,
          agencias: agenciasResponse.count || 0,
          asistenciasHoy: asistenciasResponse.count || 0
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Componente eliminado ya que ahora usamos tarjetas inline

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Bienvenido, {user?.nombre}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este es el panel de control del sistema de gestión de personal de Delizia.
          Aquí encontrarás un resumen de la información más relevante.
        </Typography>
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Button 
            variant="outlined"
            component={RouterLink}
            to="/system-status"
            size="small"
          >
            Estado del Sistema
          </Button>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'primary.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <PeopleIcon sx={{ color: 'primary.700' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div">
                        {stats.empleados}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Empleados
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<AddIcon />}
                      component={RouterLink}
                      to="/empleados/nuevo"
                      fullWidth
                    >
                      Nuevo Empleado
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'success.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <BusinessIcon sx={{ color: 'success.700' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div">
                        {stats.agencias}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Agencias
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<AddIcon />}
                      component={RouterLink}
                      to="/agencias/nueva"
                      fullWidth
                      color="success"
                    >
                      Nueva Agencia
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'warning.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <AssignmentIcon sx={{ color: 'warning.700' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div">
                        {stats.asistenciasHoy}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Asistencias (Hoy)
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      component={RouterLink}
                      to="/asistencias"
                      fullWidth
                      color="warning"
                    >
                      Ver Asistencias
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'error.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <PersonIcon sx={{ color: 'error.700' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div">
                        N/A
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Usuarios
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
            <Typography variant="h5">
              Gestión de Personal
            </Typography>
            <Button 
              variant="outlined" 
              component={RouterLink}
              to="/empleados"
            >
              Ver Todos los Empleados
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'info.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <AssessmentIcon sx={{ color: 'info.700' }} />
                    </Box>
                    <Typography variant="h6">
                      Evaluaciones de Desempeño
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Gestiona las evaluaciones de desempeño de tus empleados
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/desempeno"
                    fullWidth
                    color="info"
                  >
                    Ver Evaluaciones
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'secondary.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <CommentIcon sx={{ color: 'secondary.700' }} />
                    </Box>
                    <Typography variant="h6">
                      Observaciones
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Registra observaciones sobre el comportamiento y desempeño
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/observaciones"
                    fullWidth
                    color="secondary"
                  >
                    Ver Observaciones
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'warning.100',
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        mr: 2
                      }}
                    >
                      <AssignmentIcon sx={{ color: 'warning.700' }} />
                    </Box>
                    <Typography variant="h6">
                      Registro de Asistencias
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Controla la asistencia diaria de los empleados
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/asistencias/nueva"
                    fullWidth
                    color="warning"
                  >
                    Registrar Asistencia
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
            <Typography variant="h5">
              Configuración
            </Typography>
            <Button 
              variant="outlined" 
              component={RouterLink}
              to="/agencias"
            >
              Gestionar Agencias
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AgenciaPredeterminada />
            </Grid>
            <Grid item xs={12} md={6}>
              {agenciaService.getDefaultAgencia() && (
                <InfoAgencia agenciaId={agenciaService.getDefaultAgencia()} />
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
              <ListaAgenciasResumen />
            </Grid>
            {/* Componentes de prueba eliminados */}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
