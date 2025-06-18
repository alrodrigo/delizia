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
  FormHelperText,
  Alert,
  AlertTitle
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import observacionService from '../../services/observacionService';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';

const FormularioObservacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const preselectedEmpleadoId = location.state?.empleadoId;
  
  const [formData, setFormData] = useState({
    empleado: preselectedEmpleadoId || '',
    tipo: 'neutral',
    titulo: '',
    descripcion: '',
    desarrollo: '',
    registradoPor: user?.id
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
        
        // Si estamos editando, cargar los datos de la observación
        if (isEditing) {
          const observacionData = await observacionService.getById(id);
          setFormData({
            empleado: observacionData.empleado || '',
            tipo: observacionData.tipo || 'neutral',
            titulo: observacionData.titulo || '',
            descripcion: observacionData.descripcion || '',
            desarrollo: observacionData.desarrollo || '',
            registradoPor: observacionData.registradoPor || user?.id
          });
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
    
    if (!formData.titulo) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaveLoading(true);
      
      const dataToSend = {
        ...formData,
        registradoPor: user?.id
      };
      
      if (isEditing) {
        await observacionService.update(id, dataToSend);
      } else {
        await observacionService.create(dataToSend);
      }
      
      setSuccess(true);
      setSaveLoading(false);
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        if (preselectedEmpleadoId) {
          navigate(`/empleados/${preselectedEmpleadoId}/observaciones`);
        } else {
          navigate('/observaciones');
        }
      }, 1500);
    } catch (err) {
      console.error('Error al guardar observación:', err);
      setError('Error al guardar la observación');
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
          {isEditing ? 'Editar Observación' : 'Nueva Observación'}
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={preselectedEmpleadoId ? `/empleados/${preselectedEmpleadoId}/observaciones` : '/observaciones'}
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
          La observación se ha guardado correctamente.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
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
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">Tipo de observación</InputLabel>
                <Select
                  labelId="tipo-label"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo de observación"
                >
                  <MenuItem value="positiva">Positiva</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="negativa">Negativa</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                error={Boolean(errors.titulo)}
                helperText={errors.titulo}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={4}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
                required
                placeholder="Describa brevemente la situación u observación"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Desarrollo"
                multiline
                rows={6}
                name="desarrollo"
                value={formData.desarrollo}
                onChange={handleChange}
                placeholder="Detalles adicionales sobre la observación, seguimiento, resolución, etc."
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
      </Paper>
    </Box>
  );
};

export default FormularioObservacion;
