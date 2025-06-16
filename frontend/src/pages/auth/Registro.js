import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Alert,
  Link,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

const Registro = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required('El nombre es obligatorio'),
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('Debes confirmar la contraseña'),
    rol: Yup.string()
      .required('El rol es obligatorio')
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'operador'
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        // Omitimos confirmPassword ya que no es parte del modelo
        const { confirmPassword, ...userData } = values;
        await register(userData);
        navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión para continuar.' } });
      } catch (err) {
        setError(err.message || 'Error al crear la cuenta');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Registro de Usuario
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="nombre"
            label="Nombre"
            name="nombre"
            autoComplete="name"
            autoFocus
            value={formik.values.nombre}
            onChange={formik.handleChange}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          
          <FormControl 
            fullWidth 
            margin="normal"
            error={formik.touched.rol && Boolean(formik.errors.rol)}
          >
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              id="rol"
              name="rol"
              value={formik.values.rol}
              onChange={formik.handleChange}
              label="Rol"
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
              <MenuItem value="operador">Operador</MenuItem>
            </Select>
            {formik.touched.rol && formik.errors.rol && (
              <FormHelperText>{formik.errors.rol}</FormHelperText>
            )}
          </FormControl>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registro;
