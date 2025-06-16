import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  CircularProgress,
  Breadcrumbs,
  Link,
  FormHelperText,
  Alert,
  Card
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import empleadoService from '../../services/empleadoService';
import agenciaService from '../../services/agenciaService';

const FormularioEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(id ? true : false);
  const [agencias, setAgencias] = useState([]);
  const [error, setError] = useState(null);
  
  const isEditing = !!id;

  const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    ci: Yup.string().required('El CI es obligatorio'),
    sexo: Yup.string().required('El sexo es obligatorio').oneOf(['masculino', 'femenino', 'otro'], 'Seleccione una opción válida'),
    edad: Yup.number().positive('La edad debe ser positiva').integer('La edad debe ser un número entero'),
    telefono: Yup.string(),
    direccion: Yup.string(),
    fechaNacimiento: Yup.date(),
    fechaContratacion: Yup.date(),
    puesto: Yup.string().required('El puesto es obligatorio'),
    agencia: Yup.string(),
    antecedentes: Yup.string(),
    cargosAnteriores: Yup.string(),
    recomendaciones: Yup.string(),
    activo: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      ci: '',
      sexo: '',
      edad: '',
      telefono: '',
      direccion: '',
      fechaNacimiento: '',
      fechaContratacion: new Date().toISOString().split('T')[0],
      puesto: '',
      cargo: '',
      agencia: agenciaService.getDefaultAgencia() || '',
      antecedentes: '',
      cargosAnteriores: '',
      recomendaciones: '',
      activo: true
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        // Asegurar que cargo tenga un valor si no se proporciona
        const dataToSend = {
          ...values,
          cargo: values.cargo || values.puesto
        };
        
        if (isEditing) {
          await empleadoService.update(id, dataToSend);
          toast.success('Empleado actualizado correctamente');
          navigate(`/empleados/${id}/perfil`);
        } else {
          const response = await empleadoService.create(dataToSend);
          toast.success('Empleado creado correctamente');
          // Redirigir al perfil del empleado recién creado
          const empleadoId = response.data?._id || response._id;
          if (empleadoId) {
            navigate(`/empleados/${empleadoId}/perfil`);
          } else {
            navigate('/empleados');
          }
        }
      } catch (err) {
        setError(err.message || 'Ocurrió un error al procesar los datos');
        console.error('Error al guardar empleado:', err);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        const response = await agenciaService.getAll();
        setAgencias(response.data || []);
      } catch (err) {
        console.error('Error al cargar agencias:', err);
        toast.error('Error al cargar la lista de agencias');
      }
    };

    fetchAgencias();
  }, []);

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (isEditing) {
        try {
          setInitializing(true);
          console.log('Cargando empleado con ID:', id);
          const empleado = await empleadoService.getById(id);
          console.log('Datos del empleado recibidos:', empleado);

          // Formatear fechas para el formulario
          const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toISOString().split('T')[0];
          };

          formik.setValues({
            nombre: empleado.nombre || '',
            apellido: empleado.apellido || '',
            ci: empleado.ci || '',
            sexo: empleado.sexo || '',
            edad: empleado.edad || '',
            telefono: empleado.telefono || '',
            direccion: empleado.direccion || '',
            fechaNacimiento: formatDate(empleado.fechaNacimiento),
            fechaContratacion: formatDate(empleado.fechaContratacion),
            puesto: empleado.puesto || '',
            cargo: empleado.cargo || '',
            agencia: empleado.agencia?._id || '',
            antecedentes: empleado.antecedentes || '',
            cargosAnteriores: empleado.cargosAnteriores || '',
            recomendaciones: empleado.recomendaciones || '',
            activo: empleado.activo !== undefined ? empleado.activo : true
          });
        } catch (err) {
          console.error('Error al cargar datos del empleado:', err);
          setError(`Error al cargar los datos del empleado: ${err.message || 'Error desconocido'}`);
          toast.error('Error al cargar los datos del empleado');
        } finally {
          setInitializing(false);
        }
      }
    };

    fetchEmpleado();
  }, [id, isEditing]); // Removemos formik y navigate de las dependencias

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3 }}
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/empleados"
        >
          Empleados
        </Link>
        <Typography color="text.primary">
          {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="apellido"
                name="apellido"
                label="Apellido"
                value={formik.values.apellido}
                onChange={formik.handleChange}
                error={formik.touched.apellido && Boolean(formik.errors.apellido)}
                helperText={formik.touched.apellido && formik.errors.apellido}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="ci"
                name="ci"
                label="CI"
                value={formik.values.ci}
                onChange={formik.handleChange}
                error={formik.touched.ci && Boolean(formik.errors.ci)}
                helperText={formik.touched.ci && formik.errors.ci}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.sexo && Boolean(formik.errors.sexo)}
              >
                <InputLabel id="sexo-label">Sexo</InputLabel>
                <Select
                  labelId="sexo-label"
                  id="sexo"
                  name="sexo"
                  value={formik.values.sexo}
                  onChange={formik.handleChange}
                  label="Sexo"
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
                {formik.touched.sexo && formik.errors.sexo && (
                  <FormHelperText>{formik.errors.sexo}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="edad"
                name="edad"
                label="Edad"
                type="number"
                value={formik.values.edad}
                onChange={formik.handleChange}
                error={formik.touched.edad && Boolean(formik.errors.edad)}
                helperText={formik.touched.edad && formik.errors.edad}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                helperText={formik.touched.telefono && formik.errors.telefono}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="direccion"
                name="direccion"
                label="Dirección"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                helperText={formik.touched.direccion && formik.errors.direccion}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fechaNacimiento"
                name="fechaNacimiento"
                label="Fecha de Nacimiento"
                type="date"
                value={formik.values.fechaNacimiento}
                onChange={formik.handleChange}
                error={formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento)}
                helperText={formik.touched.fechaNacimiento && formik.errors.fechaNacimiento}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fechaContratacion"
                name="fechaContratacion"
                label="Fecha de Contratación"
                type="date"
                value={formik.values.fechaContratacion}
                onChange={formik.handleChange}
                error={formik.touched.fechaContratacion && Boolean(formik.errors.fechaContratacion)}
                helperText={formik.touched.fechaContratacion && formik.errors.fechaContratacion}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="puesto"
                name="puesto"
                label="Puesto *"
                value={formik.values.puesto}
                onChange={formik.handleChange}
                error={formik.touched.puesto && Boolean(formik.errors.puesto)}
                helperText={formik.touched.puesto && formik.errors.puesto}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="cargo"
                name="cargo"
                label="Cargo (opcional)"
                value={formik.values.cargo}
                onChange={formik.handleChange}
                error={formik.touched.cargo && Boolean(formik.errors.cargo)}
                helperText={(formik.touched.cargo && formik.errors.cargo) || "Si no se especifica, se usará el puesto"}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Información Adicional</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="antecedentes"
                name="antecedentes"
                label="Antecedentes"
                multiline
                rows={4}
                value={formik.values.antecedentes}
                onChange={formik.handleChange}
                error={formik.touched.antecedentes && Boolean(formik.errors.antecedentes)}
                helperText={formik.touched.antecedentes && formik.errors.antecedentes}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="cargosAnteriores"
                name="cargosAnteriores"
                label="Cargos Anteriores"
                multiline
                rows={4}
                value={formik.values.cargosAnteriores}
                onChange={formik.handleChange}
                error={formik.touched.cargosAnteriores && Boolean(formik.errors.cargosAnteriores)}
                helperText={formik.touched.cargosAnteriores && formik.errors.cargosAnteriores}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="recomendaciones"
                name="recomendaciones"
                label="Recomendaciones"
                multiline
                rows={4}
                value={formik.values.recomendaciones}
                onChange={formik.handleChange}
                error={formik.touched.recomendaciones && Boolean(formik.errors.recomendaciones)}
                helperText={formik.touched.recomendaciones && formik.errors.recomendaciones}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {agencias.length > 0 ? (
                <FormControl 
                  fullWidth 
                  margin="normal"
                  error={formik.touched.agencia && Boolean(formik.errors.agencia)}
                >
                  <InputLabel id="agencia-label">Agencia</InputLabel>
                  <Select
                    labelId="agencia-label"
                    id="agencia"
                    name="agencia"
                    value={formik.values.agencia}
                    onChange={formik.handleChange}
                    label="Agencia"
                    sx={{
                      minWidth: '200px',
                      '& .MuiSelect-select': {
                        padding: '16.5px 14px',
                        width: '100%'
                      }
                    }}
                  >
                    {agencias.map((agencia) => (
                      <MenuItem key={agencia._id} value={agencia._id}>
                        {agencia.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.agencia && formik.errors.agencia && (
                    <FormHelperText>{formik.errors.agencia}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    No hay agencias disponibles. Debes crear al menos una agencia para continuar.
                  </Alert>
                  <Button
                    component={RouterLink}
                    to="/agencias/nueva"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Crear Nueva Agencia
                  </Button>
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.activo}
                    onChange={(e) => formik.setFieldValue('activo', e.target.checked)}
                    name="activo"
                    color="primary"
                  />
                }
                label="Empleado Activo"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar' : 'Guardar')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/empleados"
                  variant="outlined"
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormularioEmpleado;
