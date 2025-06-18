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
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Info as InfoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import observacionService from '../../services/observacionService';
import empleadoService from '../../services/empleadoService';
import { formatDate, truncateText } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';

const ListaObservaciones = () => {
  const { user } = useAuth();
  const [observaciones, setObservaciones] = useState([]);
  const [empleados, setEmpleados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [observacionAEliminar, setObservacionAEliminar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener observaciones
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm
        };
        
        const observacionesData = await observacionService.getAll(params);
        setObservaciones(observacionesData.data || []);
        setTotalItems(observacionesData.count || 0);
        
        // Obtener datos de empleados para mostrar nombres
        const empleadosIds = observacionesData.data?.map(o => o.empleado).filter(Boolean) || [];
        const uniqueEmpleadosIds = [...new Set(empleadosIds)];
        
        const empleadosInfo = {};
        await Promise.all(
          uniqueEmpleadosIds.map(async (id) => {
            try {
              const empleado = await empleadoService.getById(id);
              empleadosInfo[id] = empleado;
            } catch (err) {
              console.error(`Error al cargar empleado ${id}:`, err);
            }
          })
        );
        
        setEmpleados(empleadosInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar observaciones:', err);
        setError('No se pudieron cargar las observaciones');
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

  if (loading && observaciones.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Observaciones</Typography>
        
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/observaciones/nueva"
          >
            Nueva Observación
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título, descripción o nombre de empleado..."
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
          <Table sx={{ minWidth: 650 }} aria-label="tabla de observaciones">
            <TableHead>
              <TableRow>
                <TableCell>Empleado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : observaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No se encontraron observaciones</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                observaciones.map((observacion) => {
                  const empleado = empleados[observacion.empleado] || {};
                  
                  return (
                    <TableRow key={observacion._id}>
                      <TableCell>
                        <Link to={`/empleados/${observacion.empleado}/perfil`} style={{ textDecoration: 'none' }}>
                          {empleado.nombre || 'Empleado no disponible'}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(observacion.fecha)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getChipIcon(observacion.tipo)}
                          label={observacion.tipo ? observacion.tipo.charAt(0).toUpperCase() + observacion.tipo.slice(1) : 'No definido'}
                          size="small"
                          color={getChipColor(observacion.tipo)}
                        />
                      </TableCell>
                      <TableCell>{observacion.titulo}</TableCell>
                      <TableCell>{truncateText(observacion.descripcion, 50)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            component={Link}
                            to={`/observaciones/editar/${observacion._id}`}
                          >
                            Ver Detalles
                          </Button>
                          
                          {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteClick(observacion)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
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

export default ListaObservaciones;
