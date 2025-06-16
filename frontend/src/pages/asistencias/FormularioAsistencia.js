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
import asistenciaService from '../../services/asistenciaService';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';

const FormularioAsistencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const preselectedEmpleadoId = location.state?.empleadoId;
  
  const [formData, setFormData] = useState({
    empleado: preselectedEmpleadoId || '',
    fecha: new Date().toISOString().split('T')[0],
    horaEntrada: '',
    horaSalida: '',
    tipoAsistencia: 'presente',
    observaciones: ''
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
        const empleadosResponse = await empleadoService.getAll({ limit: 1000 });
        setEmpleados(empleadosResponse.data || []);
        
        // Si estamos editando, cargar los datos de la asistencia
        if (isEditing) {
          const asistenciaData = await asistenciaService.getById(id);
          setFormData({
            empleado: asistenciaData.empleado || '',
            fecha: asistenciaData.fecha ? new Date(asistenciaData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            horaEntrada: asistenciaData.horaEntrada ? new Date(asistenciaData.horaEntrada).toTimeString().slice(0, 5) : '',
            horaSalida: asistenciaData.horaSalida ? new Date(asistenciaData.horaSalida).toTimeString().slice(0, 5) : '',
            tipoAsistencia: asistenciaData.tipoAsistencia || asistenciaData.estado || 'presente',
            observaciones: asistenciaData.observaciones || ''
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
  }, [id, isEditing, preselectedEmpleadoId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.empleado) {
      newErrors.empleado = 'Debe seleccionar un empleado';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    
    if (!formData.tipoAsistencia) {
      newErrors.tipoAsistencia = 'Debe seleccionar un tipo de asistencia';
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
        // Convertir las horas a timestamps completos si se proporcionan
        horaEntrada: formData.horaEntrada ? `${formData.fecha}T${formData.horaEntrada}:00` : null,
        horaSalida: formData.horaSalida ? `${formData.fecha}T${formData.horaSalida}:00` : null
      };
      
      if (isEditing) {
        await asistenciaService.update(id, dataToSend);
      } else {
        await asistenciaService.create(dataToSend);
      }
      
      setSuccess(true);
      setSaveLoading(false);
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate('/asistencias');
      }, 1500);
    } catch (err) {
      console.error('Error al guardar asistencia:', err);
      setError('Error al guardar el registro de asistencia');
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
          {isEditing ? 'Editar Asistencia' : 'Registrar Asistencia'}
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/asistencias"
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
          El registro de asistencia se ha guardado correctamente.
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
                      {empleado.nombre} {empleado.apellido} - {empleado.puesto}
                    </MenuItem>
                  ))}
                </Select>
                {errors.empleado && <FormHelperText>{errors.empleado}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                error={Boolean(errors.fecha)}
                helperText={errors.fecha}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.tipoAsistencia)}>
                <InputLabel id="tipoAsistencia-label">Tipo de Asistencia</InputLabel>
                <Select
                  labelId="tipoAsistencia-label"
                  name="tipoAsistencia"
                  value={formData.tipoAsistencia}
                  onChange={handleChange}
                  label="Tipo de Asistencia"
                >
                  <MenuItem value="presente">Presente</MenuItem>
                  <MenuItem value="ausente">Ausente</MenuItem>
                  <MenuItem value="tardanza">Tardanza</MenuItem>
                  <MenuItem value="permiso">Permiso</MenuItem>
                  <MenuItem value="vacaciones">Vacaciones</MenuItem>
                  <MenuItem value="licencia">Licencia</MenuItem>
                </Select>
                {errors.tipoAsistencia && <FormHelperText>{errors.tipoAsistencia}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora de Entrada"
                name="horaEntrada"
                type="time"
                value={formData.horaEntrada}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora de Salida"
                name="horaSalida"
                type="time"
                value={formData.horaSalida}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
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
                placeholder="Observaciones adicionales sobre la asistencia"
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

export default FormularioAsistencia;
