import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import observacionService from '../../services/observacionService';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils';

const ObservacionesEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [observacionAEliminar, setObservacionAEliminar] = useState(null);
  const [activeTab, setActiveTab] = useState(2); // Observaciones es la tab 2

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate(`/empleados/${id}/perfil`);
    } else if (newValue === 1) {
      navigate(`/empleados/${id}/desempeno`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del empleado
        const empleadoData = await empleadoService.getById(id);
        setEmpleado(empleadoData);
        
        // Obtener observaciones del empleado
        const observacionesData = await observacionService.getByEmpleado(id);
        setObservaciones(Array.isArray(observacionesData.items) ? observacionesData.items : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos del empleado u observaciones');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteClick = (observacion) => {
    setObservacionAEliminar(observacion);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!observacionAEliminar) return;
    
    try {
      await observacionService.delete(observacionAEliminar._id);
      
      // Actualizar la lista de observaciones
      setObservaciones(prevObservaciones => 
        prevObservaciones.filter(o => o._id !== observacionAEliminar._id)
      );
      
      setDeleteDialogOpen(false);
      setObservacionAEliminar(null);
    } catch (err) {
      console.error('Error al eliminar observación:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setObservacionAEliminar(null);
  };

  const getChipColor = (tipo) => {
    switch (tipo) {
      case 'positiva': return 'success';
      case 'negativa': return 'error';
      default: return 'default';
    }
  };

  const getChipIcon = (tipo) => {
    switch (tipo) {
      case 'positiva': return <ThumbUpIcon fontSize="small" />;
      case 'negativa': return <ThumbDownIcon fontSize="small" />;
      default: return <InfoIcon fontSize="small" />;
    }
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
        <Box>
          <Typography variant="h4">Observaciones del Empleado</Typography>
          <Typography variant="subtitle1">
            {empleado.nombre} - {empleado.puesto}
          </Typography>
        </Box>
        
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/observaciones/nueva"
            state={{ empleadoId: id }}
          >
            Nueva Observación
          </Button>
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

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          component={Link}
          to={`/empleados/${id}/perfil`}
          sx={{ mr: 2 }}
        >
          Ver Perfil
        </Button>
      </Box>

      {observaciones.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6">No hay observaciones registradas</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Registre la primera observación para este empleado
              </Typography>
              
              {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  component={Link}
                  to="/observaciones/nueva"
                  state={{ empleadoId: id }}
                >
                  Nueva Observación
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {observaciones.map((observacion) => (
            <Grid item xs={12} key={observacion._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {observacion.titulo}
                        </Typography>
                        <Chip 
                          icon={getChipIcon(observacion.tipo)}
                          label={observacion.tipo ? observacion.tipo.charAt(0).toUpperCase() + observacion.tipo.slice(1) : 'No definido'}
                          size="small"
                          color={getChipColor(observacion.tipo)}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(observacion.fecha)} - Registrado por: {observacion.registradoPor?.nombre || 'Usuario'}
                      </Typography>
                    </Box>
                    
                    {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
                      <Box>
                        <IconButton 
                          component={Link}
                          to={`/observaciones/editar/${observacion._id}`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteClick(observacion)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" paragraph>
                    {observacion.descripcion}
                  </Typography>
                  
                  {observacion.desarrollo && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Desarrollo:
                      </Typography>
                      <Typography variant="body2">
                        {observacion.desarrollo}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar la observación "{observacionAEliminar?.titulo}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObservacionesEmpleado;
