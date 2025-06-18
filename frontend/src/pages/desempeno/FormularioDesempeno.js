import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Rating,
  FormHelperText,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import desempenoService from '../../services/desempenoService';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';

const FormularioDesempeno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  // Obtener empleadoId de múltiples fuentes
  const searchParams = new URLSearchParams(location.search);
  const empleadoIdFromQuery = searchParams.get('empleadoId');
  const preselectedEmpleadoId = location.state?.empleadoId || empleadoIdFromQuery;
  
  console.log('FormularioDesempeno - Empleado preseleccionado:', preselectedEmpleadoId);
  console.log('FormularioDesempeno - location.state:', location.state);
  console.log('FormularioDesempeno - query params:', empleadoIdFromQuery);
  
  const [formData, setFormData] = useState({
    empleado: preselectedEmpleadoId || '',
    puntualidad: 3,
    proactividad: 3,
    calidadServicio: 3,
    observaciones: '',
    evaluacionPersonal: '',
    evaluador: user?.id
  });
  
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar lista de empleados
        const empleadosResponse = await empleadoService.getAll();
        setEmpleados(empleadosResponse.data || []);
        
        // Si estamos editando, cargar los datos del desempeño
        if (isEditing) {
          const desempenoData = await desempenoService.getById(id);
          setFormData({
            empleado: desempenoData.empleado || '',
            puntualidad: desempenoData.puntualidad || 3,
            proactividad: desempenoData.proactividad || 3,
            calidadServicio: desempenoData.calidadServicio || 3,
            observaciones: desempenoData.observaciones || '',
            evaluacionPersonal: desempenoData.evaluacionPersonal || '',
            evaluador: desempenoData.evaluador || user?.id
          });
        } else if (preselectedEmpleadoId) {
          // Si hay un empleado preseleccionado y no estamos editando, actualizamos el form
          setFormData(prev => ({
            ...prev,
            empleado: preselectedEmpleadoId,
            evaluador: user?.id
          }));
          console.log('FormularioDesempeno - Empleado preseleccionado establecido:', preselectedEmpleadoId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos necesarios');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, user?.id, preselectedEmpleadoId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.empleado) {
      newErrors.empleado = 'Debe seleccionar un empleado';
    }
    
    if (!formData.puntualidad || formData.puntualidad < 1 || formData.puntualidad > 5) {
      newErrors.puntualidad = 'La calificación debe estar entre 1 y 5';
    }
    
    if (!formData.proactividad || formData.proactividad < 1 || formData.proactividad > 5) {
      newErrors.proactividad = 'La calificación debe estar entre 1 y 5';
    }
    
    if (!formData.calidadServicio || formData.calidadServicio < 1 || formData.calidadServicio > 5) {
      newErrors.calidadServicio = 'La calificación debe estar entre 1 y 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaveLoading(true);
      
      const dataToSend = {
        ...formData,
        evaluador: user?.id
      };
      
      if (isEditing) {
        await desempenoService.update(id, dataToSend);
      } else {
        await desempenoService.create(dataToSend);
      }
      
      setSuccess(true);
      setSaveLoading(false);
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        if (preselectedEmpleadoId) {
          navigate(`/empleados/${preselectedEmpleadoId}/desempeno`);
        } else {
          navigate('/desempeno');
        }
      }, 1500);
    } catch (err) {
      console.error('Error al guardar desempeño:', err);
      setError('Error al guardar la evaluación de desempeño');
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          {isEditing ? 'Editar Evaluación de Desempeño' : 'Nueva Evaluación de Desempeño'}
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={preselectedEmpleadoId ? `/empleados/${preselectedEmpleadoId}/desempeno` : '/desempeno'}
        >
          Volver
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Éxito</AlertTitle>
          La evaluación de desempeño se ha guardado correctamente.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(errors.empleado)} disabled={Boolean(preselectedEmpleadoId)}>
                  <InputLabel id="empleado-label">Empleado</InputLabel>
                  <Select
                    labelId="empleado-label"
                    name="empleado"
                    value={formData.empleado}
                    onChange={handleChange}
                    label="Empleado"
                  >
                    {empleados.map(empleado => (
                      <MenuItem key={empleado._id} value={empleado._id}>
                        {empleado.nombre} - {empleado.puesto}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.empleado && <FormHelperText>{errors.empleado}</FormHelperText>}
                  {preselectedEmpleadoId && (
                    <FormHelperText>
                      Empleado preseleccionado desde el perfil
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Evaluación de Desempeño
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component="legend">Puntualidad</Typography>
                <Rating
                  name="puntualidad"
                  value={formData.puntualidad}
                  precision={1}
                  onChange={(event, newValue) => handleRatingChange('puntualidad', newValue)}
                />
                {errors.puntualidad && (
                  <FormHelperText error>{errors.puntualidad}</FormHelperText>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component="legend">Proactividad</Typography>
                <Rating
                  name="proactividad"
                  value={formData.proactividad}
                  precision={1}
                  onChange={(event, newValue) => handleRatingChange('proactividad', newValue)}
                />
                {errors.proactividad && (
                  <FormHelperText error>{errors.proactividad}</FormHelperText>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component="legend">Calidad de Servicio</Typography>
                <Rating
                  name="calidadServicio"
                  value={formData.calidadServicio}
                  precision={1}
                  onChange={(event, newValue) => handleRatingChange('calidadServicio', newValue)}
                />
                {errors.calidadServicio && (
                  <FormHelperText error>{errors.calidadServicio}</FormHelperText>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                multiline
                rows={4}
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Ingrese observaciones sobre el desempeño del empleado"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Evaluación Personal"
                multiline
                rows={4}
                name="evaluacionPersonal"
                value={formData.evaluacionPersonal}
                onChange={handleChange}
                placeholder="Ingrese una evaluación personal detallada del empleado"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={saveLoading}
              >
                {saveLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Grid>
          </Grid>
        </form>
        )}
      </Paper>
    </Box>
  );
};

export default FormularioDesempeno;
