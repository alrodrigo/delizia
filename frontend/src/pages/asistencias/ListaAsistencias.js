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
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import asistenciaService from '../../services/asistenciaService';
import empleadoService from '../../services/empleadoService';
import { formatDate, formatTime } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ListaAsistencias = () => {
  const { user } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroEmpleado, setFiltroEmpleado] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [asistenciaAEliminar, setAsistenciaAEliminar] = useState(null);
  const [todosEmpleados, setTodosEmpleados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener lista de todos los empleados para el filtro
        try {
          const empleadosResponse = await empleadoService.getAll();
          setTodosEmpleados(empleadosResponse.data || []);
        } catch (err) {
          console.error('Error al cargar empleados:', err);
        }
        
        // Obtener asistencias
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm
        };
        
        if (filtroFecha) {
          params.fecha = filtroFecha;
        }
        
        if (filtroEstado) {
          params.estado = filtroEstado;
        }
        
        if (filtroEmpleado) {
          params.empleado = filtroEmpleado;
        }
        
        const asistenciasData = await asistenciaService.getAll(params);
        setAsistencias(asistenciasData.data || []);
        setTotalItems(asistenciasData.count || 0);
        
        // Obtener datos de empleados para mostrar nombres
        const empleadosIds = asistenciasData.data?.map(a => a.empleado?._id || a.empleado).filter(Boolean) || [];
        const uniqueEmpleadosIds = [...new Set(empleadosIds)];
        
        const empleadosInfo = {};
        
        // Si las asistencias ya incluyen datos del empleado (populated), usarlos
        asistenciasData.data?.forEach(asistencia => {
          if (asistencia.empleado && typeof asistencia.empleado === 'object' && asistencia.empleado._id) {
            empleadosInfo[asistencia.empleado._id] = asistencia.empleado;
          }
        });
        
        // Para IDs que no tienen datos, obtenerlos individualmente
        const idsToFetch = uniqueEmpleadosIds.filter(id => !empleadosInfo[id]);
        
        await Promise.all(
          idsToFetch.map(async (id) => {
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
        
        console.log('Empleados cargados para asistencias:', empleadosInfo);
        
        setEmpleados(empleadosInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar asistencias:', err);
        setError('No se pudieron cargar las asistencias');
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, searchTerm, filtroFecha, filtroEstado, filtroEmpleado]);

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

  const handleDeleteClick = (asistencia) => {
    setAsistenciaAEliminar(asistencia);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await asistenciaService.delete(asistenciaAEliminar._id);
      toast.success('Asistencia eliminada correctamente');
      setDeleteDialogOpen(false);
      setAsistenciaAEliminar(null);
      // Recargar datos
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm
      };
      
      if (filtroFecha) params.fecha = filtroFecha;
      if (filtroEstado) params.estado = filtroEstado;
      
      const asistenciasData = await asistenciaService.getAll(params);
      setAsistencias(asistenciasData.data || []);
      setTotalItems(asistenciasData.count || 0);
    } catch (err) {
      console.error('Error al eliminar asistencia:', err);
      toast.error('Error al eliminar la asistencia');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAsistenciaAEliminar(null);
  };

  const getEstadoChip = (asistencia) => {
    // Usar tipoAsistencia o estado como fallback
    const estado = asistencia.tipoAsistencia || asistencia.estado;
    
    switch (estado) {
      case 'presente':
        return <Chip icon={<CheckCircleIcon />} label="Presente" color="success" size="small" />;
      case 'ausente':
        return <Chip icon={<CancelIcon />} label="Ausente" color="error" size="small" />;
      case 'tardanza':
        return <Chip icon={<ScheduleIcon />} label="Tardanza" color="warning" size="small" />;
      case 'permiso':
        return <Chip icon={<ScheduleIcon />} label="Permiso" color="info" size="small" />;
      case 'vacaciones':
        return <Chip icon={<ScheduleIcon />} label="Vacaciones" color="primary" size="small" />;
      case 'licencia':
        return <Chip icon={<ScheduleIcon />} label="Licencia" color="secondary" size="small" />;
      default:
        return <Chip label={`No definido (${estado || 'sin estado'})`} color="default" size="small" />;
    }
  };

  const getResumenAsistencias = () => {
    const presentes = asistencias.filter(a => (a.tipoAsistencia || a.estado) === 'presente').length;
    const ausentes = asistencias.filter(a => (a.tipoAsistencia || a.estado) === 'ausente').length;
    const tardanzas = asistencias.filter(a => (a.tipoAsistencia || a.estado) === 'tardanza').length;
    
    return { presentes, ausentes, tardanzas };
  };

  const resumen = getResumenAsistencias();

  if (loading && asistencias.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Asistencias</Typography>
        
        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/asistencias/nueva"
          >
            Registrar Asistencia
          </Button>
        )}
      </Box>

      {/* Resumen de asistencias */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h4">{resumen.presentes}</Typography>
                  <Typography color="text.secondary">Presentes</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h4">{resumen.ausentes}</Typography>
                  <Typography color="text.secondary">Ausentes</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h4">{resumen.tardanzas}</Typography>
                  <Typography color="text.secondary">Tardanzas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por empleado..."
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
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="presente">Presente</MenuItem>
                <MenuItem value="ausente">Ausente</MenuItem>
                <MenuItem value="tardanza">Tardanza</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Empleado</InputLabel>
              <Select
                value={filtroEmpleado}
                onChange={(e) => setFiltroEmpleado(e.target.value)}
                label="Empleado"
              >
                <MenuItem value="">Todos los empleados</MenuItem>
                {todosEmpleados.map((empleado) => (
                  <MenuItem key={empleado._id} value={empleado._id}>
                    {empleado.nombre} {empleado.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de asistencias">
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora Entrada</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Observaciones</TableCell>
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
            ) : asistencias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No se encontraron registros de asistencias</Typography>
                </TableCell>
              </TableRow>
            ) : (
              asistencias.map((asistencia) => {
                const empleadoId = asistencia.empleado?._id || asistencia.empleado;
                const empleado = empleados[empleadoId] || asistencia.empleado || {};
                const nombreEmpleado = empleado.nombre || 'Empleado no disponible';
                
                return (
                  <TableRow key={asistencia._id}>
                    <TableCell>
                      <Link to={`/empleados/${empleadoId}/perfil`} style={{ textDecoration: 'none' }}>
                        {nombreEmpleado}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(asistencia.fecha)}</TableCell>
                    <TableCell>{asistencia.horaEntrada ? formatTime(asistencia.horaEntrada) : '-'}</TableCell>
                    <TableCell>{asistencia.horaSalida ? formatTime(asistencia.horaSalida) : '-'}</TableCell>
                    <TableCell>{getEstadoChip(asistencia)}</TableCell>
                    <TableCell>{asistencia.observaciones || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<EditIcon />}
                          component={Link}
                          to={`/asistencias/editar/${asistencia._id}`}
                        >
                          Editar
                        </Button>
                        {(user?.id === 1 || user?._id === 1 || user?.rol === 'admin') && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(asistencia)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

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
      </TableContainer>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea eliminar este registro de asistencia? Esta acción no se puede deshacer.
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

export default ListaAsistencias;
