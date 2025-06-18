import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';

const PerfilEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar datos del empleado
  const fetchEmpleado = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Cargando empleado con ID:', id);
      // Añadir timestamp para evitar caché
      const timestamp = new Date().getTime();
      const data = await empleadoService.getById(id);
      console.log(`Datos del empleado cargados (${timestamp}):`, data);
      setEmpleado(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar empleado:', err);
      setError('No se pudo cargar la información del empleado');
      setLoading(false);
    }
  }, [id]);
  
  // Cargar datos al montar el componente o cambiar el ID
  useEffect(() => {
    fetchEmpleado();
  }, [id, fetchEmpleado]);
  
  // Cargar datos al enfocar la ventana (cuando regresa de otra página)
  useEffect(() => {
    // Función para recargar datos cuando el usuario regresa a esta página
    const handleFocus = () => {
      console.log('🔄 Ventana enfocada, recargando datos del empleado...');
      fetchEmpleado();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // También podemos recargar cuando la ruta coincide exactamente con este perfil
    if (window.location.pathname === `/empleados/${id}/perfil`) {
      fetchEmpleado();
    }
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id, fetchEmpleado]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1) {
      navigate(`/empleados/${id}/desempeno`);
    } else if (newValue === 2) {
      navigate(`/empleados/${id}/observaciones`);
    }
  };

  const handleEditarClick = () => {
    navigate(`/empleados/editar/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !empleado) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error || 'Empleado no encontrado'}</Typography>
        <Button component={Link} to="/empleados" sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Perfil de Empleado</Typography>
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<AssignmentIcon />}
              component={Link}
              to={`/desempeno/nuevo?empleadoId=${id}`}
              state={{ empleadoId: id }}
            >
              Evaluar Desempeño
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EditIcon />}
              onClick={handleEditarClick}
            >
              Editar
            </Button>
          </Box>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="perfil empleado tabs">
            <Tab icon={<PersonIcon />} label="Información Personal" />
            <Tab icon={<AssignmentIcon />} label="Desempeño" />
            <Tab icon={<CommentIcon />} label="Observaciones" />
          </Tabs>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5">{empleado.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {empleado.puesto}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Sexo" 
                    secondary={empleado.sexo || 'No especificado'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Edad" 
                    secondary={empleado.edad ? `${empleado.edad} años` : 'No especificada'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Correo" 
                    secondary={empleado.correo || 'No especificado'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Teléfono" 
                    secondary={empleado.telefono || 'No especificado'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Antecedentes</Typography>
                  <Typography variant="body1">
                    {empleado.antecedentes || 'No se han registrado antecedentes para este empleado.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Cargos Anteriores</Typography>
                  <Typography variant="body1">
                    {empleado.cargosAnteriores || 'No se han registrado cargos anteriores para este empleado.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recomendaciones</Typography>
                  <Typography variant="body1">
                    {empleado.recomendaciones || 'No se han registrado recomendaciones para este empleado.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerfilEmpleado;
