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
  Rating,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import desempenoService from '../../services/desempenoService';
import empleadoService from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils';

const DesempenoEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState(null);
  const [desempenos, setDesempenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // Desempeño es la tab 1

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate(`/empleados/${id}/perfil`);
    } else if (newValue === 2) {
      navigate(`/empleados/${id}/observaciones`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Cargando datos para empleado ID:', id);
        console.log('Usuario actual:', user);
        console.log('Usuario ID:', user?.id);
        console.log('Usuario _id:', user?._id);
        console.log('Usuario rol:', user?.rol);
        
        // Obtener datos del empleado
        const empleadoData = await empleadoService.getById(id);
        console.log('Datos del empleado:', empleadoData);
        setEmpleado(empleadoData);
        
        // Obtener desempeños del empleado
        const desempenosData = await desempenoService.getByEmpleado(id);
        console.log('Datos de desempeño:', desempenosData);
        setDesempenos(Array.isArray(desempenosData.data) ? desempenosData.data : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos del empleado o desempeños');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Calcular promedios
  const calcularPromedio = (campo) => {
    if (!desempenos.length) return 0;
    const suma = desempenos.reduce((acc, item) => acc + item[campo], 0);
    return (suma / desempenos.length).toFixed(1);
  }

  const getColorByRating = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
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
          <Typography variant="h4">Desempeño del Empleado</Typography>
          <Typography variant="subtitle1">
            {empleado.nombre} - {empleado.puesto}
          </Typography>
        </Box>
        {/* Mostrar botón si el usuario está autenticado */}
        {user && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to={`/desempeno/nuevo?empleadoId=${id}`}
            state={{ empleadoId: id }}
          >
            Nueva Evaluación
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
        
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/desempeno/nuevo"
            state={{ empleadoId: id }}
          >
            Nueva Evaluación
          </Button>
        )}
      </Box>

      {desempenos.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6">No hay evaluaciones de desempeño registradas</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Registre la primera evaluación para este empleado
              </Typography>
              
              {/* Mostrar botón si el usuario está autenticado */}
              {user && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  component={Link}
                  to={`/desempeno/nuevo?empleadoId=${id}`}
                  state={{ empleadoId: id }}
                >
                  Nueva Evaluación
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Puntualidad</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {calcularPromedio('puntualidad')}
                    </Typography>
                    <Rating value={parseFloat(calcularPromedio('puntualidad'))} precision={0.5} readOnly />
                  </Box>
                  <Chip 
                    color={getColorByRating(parseFloat(calcularPromedio('puntualidad')))} 
                    label={parseFloat(calcularPromedio('puntualidad')) >= 4 ? 'Excelente' : parseFloat(calcularPromedio('puntualidad')) >= 3 ? 'Bueno' : 'Necesita mejorar'} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Proactividad</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {calcularPromedio('proactividad')}
                    </Typography>
                    <Rating value={parseFloat(calcularPromedio('proactividad'))} precision={0.5} readOnly />
                  </Box>
                  <Chip 
                    color={getColorByRating(parseFloat(calcularPromedio('proactividad')))} 
                    label={parseFloat(calcularPromedio('proactividad')) >= 4 ? 'Excelente' : parseFloat(calcularPromedio('proactividad')) >= 3 ? 'Bueno' : 'Necesita mejorar'} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Calidad de Servicio</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {calcularPromedio('calidadServicio')}
                    </Typography>
                    <Rating value={parseFloat(calcularPromedio('calidadServicio'))} precision={0.5} readOnly />
                  </Box>
                  <Chip 
                    color={getColorByRating(parseFloat(calcularPromedio('calidadServicio')))} 
                    label={parseFloat(calcularPromedio('calidadServicio')) >= 4 ? 'Excelente' : parseFloat(calcularPromedio('calidadServicio')) >= 3 ? 'Bueno' : 'Necesita mejorar'} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ my: 2 }}>Historial de Evaluaciones</Typography>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabla de desempeño">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Puntualidad</TableCell>
                  <TableCell>Proactividad</TableCell>
                  <TableCell>Calidad de Servicio</TableCell>
                  <TableCell>Observaciones</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {desempenos.map((desempeno) => (
                  <TableRow key={desempeno._id}>
                    <TableCell>{formatDate(desempeno.fecha)}</TableCell>
                    <TableCell>
                      <Rating value={desempeno.puntualidad} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Rating value={desempeno.proactividad} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Rating value={desempeno.calidadServicio} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      {desempeno.observaciones?.substring(0, 30)}
                      {desempeno.observaciones?.length > 30 ? '...' : ''}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to={`/desempeno/editar/${desempeno._id}`}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default DesempenoEmpleado;
