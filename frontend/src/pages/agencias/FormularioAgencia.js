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
  CircularProgress,
  Breadcrumbs,
  Link,
  FormHelperText,
  Alert
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import agenciaService from '../../services/agenciaService';
import authService from '../../services/authService';

const FormularioAgencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(id ? true : false);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  
  const isEditing = !!id;

  const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    direccion: Yup.string().required('La dirección es obligatoria'),
    ciudad: Yup.string().required('La ciudad es obligatoria'),
    telefono: Yup.string(),
    encargado: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      direccion: '',
      ciudad: '',
      telefono: '',
      encargado: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        if (isEditing) {
          await agenciaService.update(id, values);
          toast.success('Agencia actualizada correctamente');
        } else {
          await agenciaService.create(values);
          toast.success('Agencia creada correctamente');
        }
        navigate('/agencias');
      } catch (err) {
        setError(err.message || 'Ocurrió un error al procesar los datos');
        console.error('Error al guardar agencia:', err);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // Suponiendo que hay un endpoint para obtener usuarios que pueden ser encargados (roles específicos)
        // Esta llamada debería adaptarse a la API real
        const response = await authService.getAdminUsers();
        setUsuarios(response.data || []);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        // No mostramos toast para no sobrecargar la interfaz, ya que no es crítico
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchAgencia = async () => {
      if (isEditing) {
        try {
          setInitializing(true);
          const response = await agenciaService.getById(id);
          const agencia = response.data;

          formik.setValues({
            nombre: agencia.nombre || '',
            direccion: agencia.direccion || '',
            ciudad: agencia.ciudad || '',
            telefono: agencia.telefono || '',
            encargado: agencia.encargado?._id || ''
          });
        } catch (err) {
          console.error('Error al cargar datos de la agencia:', err);
          toast.error('Error al cargar los datos de la agencia');
          navigate('/agencias');
        } finally {
          setInitializing(false);
        }
      }
    };

    fetchAgencia();
  }, [id, isEditing, navigate]);

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
          to="/agencias"
        >
          Agencias
        </Link>
        <Typography color="text.primary">
          {isEditing ? 'Editar Agencia' : 'Nueva Agencia'}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar Agencia' : 'Nueva Agencia'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre de la Agencia"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
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
                id="ciudad"
                name="ciudad"
                label="Ciudad"
                value={formik.values.ciudad}
                onChange={formik.handleChange}
                error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                helperText={formik.touched.ciudad && formik.errors.ciudad}
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
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.encargado && Boolean(formik.errors.encargado)}
              >
                <InputLabel id="encargado-label">Encargado</InputLabel>
                <Select
                  labelId="encargado-label"
                  id="encargado"
                  name="encargado"
                  value={formik.values.encargado}
                  onChange={formik.handleChange}
                  label="Encargado"
                >
                  <MenuItem value="">
                    <em>No asignado</em>
                  </MenuItem>
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario._id} value={usuario._id}>
                      {usuario.nombre} ({usuario.email})
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.encargado && formik.errors.encargado && (
                  <FormHelperText>{formik.errors.encargado}</FormHelperText>
                )}
              </FormControl>
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
                  to="/agencias"
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

export default FormularioAgencia;
