import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import desempenoService from '../../services/desempenoService';
import empleadoService from '../../services/empleadoService';
import { formatDate } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';

const ListaDesempeno = () => {
  const { user } = useAuth();
  const [desempenos, setDesempenos] = useState([]);
  const [empleados, setEmpleados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener evaluaciones de desempeño
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm
        };
        
        const desempenosData = await desempenoService.getAll(params);
        setDesempenos(desempenosData.data || []);
        setTotalItems(desempenosData.count || 0);
        
        // Obtener datos de empleados para mostrar nombres
        const empleadosIds = desempenosData.data?.map(d => d.empleado).filter(Boolean) || [];
        const uniqueEmpleadosIds = [...new Set(empleadosIds)];
        
        console.log('IDs de empleados a cargar:', uniqueEmpleadosIds);
        
        const empleadosInfo = {};
        await Promise.all(
          uniqueEmpleadosIds.map(async (id) => {
            try {
              console.log('Cargando empleado con ID:', id);
              const empleado = await empleadoService.getById(id);
              console.log('Empleado cargado:', empleado);
              empleadosInfo[id] = empleado;
            } catch (err) {
              console.error(`Error al cargar empleado ${id}:`, err);
              empleadosInfo[id] = { nombre: 'Empleado no encontrado', _id: id };
            }
          })
        );
        
        console.log('Todos los empleados cargados:', empleadosInfo);
        
        setEmpleados(empleadosInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar evaluaciones:', err);
        setError('No se pudieron cargar las evaluaciones de desempeño');
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(search);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchTerm('');
    setPage(0);
  };

  const getColorByRating = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const calcularPromedio = (desempeno) => {
    const ratings = [desempeno.puntualidad, desempeno.proactividad, desempeno.calidadServicio];
    const sum = ratings.reduce((a, b) => a + b, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading && desempenos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Evaluaciones de Desempeño</Typography>
        
        {user && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/desempeno/nuevo"
          >
            Nueva Evaluación
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre de empleado o comentarios..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </form>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de evaluaciones de desempeño">
            <TableHead>
              <TableRow>
                <TableCell>Empleado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Puntualidad</TableCell>
                <TableCell>Proactividad</TableCell>
                <TableCell>Calidad</TableCell>
                <TableCell>Promedio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : desempenos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No se encontraron evaluaciones de desempeño</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                desempenos.map((desempeno) => {
                  // Extraer información del empleado
                  let empleadoId, empleadoNombre;
                  
                  if (typeof desempeno.empleado === 'object' && desempeno.empleado !== null) {
                    // Si el empleado está poblado (populate)
                    empleadoId = desempeno.empleado._id;
                    empleadoNombre = desempeno.empleado.nombre;
                  } else if (typeof desempeno.empleado === 'string') {
                    // Si es solo el ID
                    empleadoId = desempeno.empleado;
                    empleadoNombre = empleados[empleadoId]?.nombre || 'Empleado no encontrado';
                  } else {
                    empleadoId = null;
                    empleadoNombre = 'Empleado no disponible';
                  }
                  
                  const promedio = calcularPromedio(desempeno);
                  
                  console.log('Renderizando desempeño:', desempeno);
                  console.log('Empleado ID:', empleadoId);
                  console.log('Empleado nombre:', empleadoNombre);
                  
                  return (
                    <TableRow key={desempeno._id}>
                      <TableCell>
                        {empleadoId ? (
                          <Link to={`/empleados/${empleadoId}/perfil`} style={{ textDecoration: 'none' }}>
                            {empleadoNombre}
                          </Link>
                        ) : (
                          <span>{empleadoNombre}</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(desempeno.fecha)}</TableCell>
                      <TableCell>
                        <Rating value={desempeno.puntualidad} size="small" precision={0.5} readOnly />
                      </TableCell>
                      <TableCell>
                        <Rating value={desempeno.proactividad} size="small" precision={0.5} readOnly />
                      </TableCell>
                      <TableCell>
                        <Rating value={desempeno.calidadServicio} size="small" precision={0.5} readOnly />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {promedio}
                          </Typography>
                          <Chip
                            size="small"
                            color={getColorByRating(parseFloat(promedio))}
                            label={parseFloat(promedio) >= 4 ? 'Excelente' : parseFloat(promedio) >= 3 ? 'Bueno' : 'Regular'}
                          />
                        </Box>
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default ListaDesempeno;
