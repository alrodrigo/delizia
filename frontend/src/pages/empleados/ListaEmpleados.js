import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import empleadoService from '../../services/empleadoService';
import FiltroAgencia from '../../components/empleados/FiltroAgencia';

const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [selectedAgencia, setSelectedAgencia] = useState('');

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1, // API espera páginas desde 1, pero MUI usa desde 0
        limit: rowsPerPage
      };
      
      if (searchTerm) {
        params.nombre = searchTerm;
      }
      
      // Si hay una agencia seleccionada, la incluimos en los parámetros
      if (selectedAgencia) {
        params.agencia = selectedAgencia;
      }
      
      const response = await empleadoService.getAll(params);
      setEmpleados(response.data || []);
      setTotalEmpleados(response.count || 0);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      toast.error('Error al cargar la lista de empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [page, rowsPerPage, searchTerm, selectedAgencia]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFetchEmpleados = React.useCallback(fetchEmpleados, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAgenciaChange = (agenciaId) => {
    setSelectedAgencia(agenciaId);
    setPage(0);
  };

  const handleDeleteClick = (empleado) => {
    setEmpleadoToDelete(empleado);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!empleadoToDelete) return;
    
    try {
      await empleadoService.delete(empleadoToDelete._id);
      toast.success(`Empleado ${empleadoToDelete.nombre} eliminado correctamente`);
      fetchEmpleados();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      toast.error('Error al eliminar el empleado');
    } finally {
      setDeleteDialogOpen(false);
      setEmpleadoToDelete(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Empleados</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/empleados/nuevo"
        >
          Nuevo Empleado
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FiltroAgencia 
            onAgenciaChange={handleAgenciaChange}
            selectedAgencia={selectedAgencia}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Buscar por nombre"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>CI</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Agencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : empleados.length > 0 ? (
              empleados.map((empleado) => (
                <TableRow key={empleado._id}>
                  <TableCell>{empleado.nombre || '-'}</TableCell>
                  <TableCell>{empleado.apellido || '-'}</TableCell>
                  <TableCell>{empleado.ci || '-'}</TableCell>
                  <TableCell>{empleado.puesto || '-'}</TableCell>
                  <TableCell>{empleado.agencia?.nombre || 'No asignada'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={empleado.activo ? 'Activo' : 'Inactivo'} 
                      color={empleado.activo ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton 
                        component={RouterLink} 
                        to={`/empleados/${empleado._id}/perfil`}
                        color="info"
                        size="small"
                        title="Ver perfil"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        component={RouterLink}
                        to={`/empleados/${empleado._id}/desempeno`}
                        color="success"
                        size="small"
                        title="Ver desempeño"
                      >
                        <AssessmentIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        component={RouterLink}
                        to={`/empleados/${empleado._id}/observaciones`}
                        color="secondary"
                        size="small"
                        title="Ver observaciones"
                      >
                        <CommentIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        component={RouterLink} 
                        to={`/empleados/editar/${empleado._id}`}
                        color="primary"
                        size="small"
                        title="Editar empleado"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteClick(empleado)}
                        title="Eliminar empleado"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalEmpleados}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar a {empleadoToDelete?.nombre} {empleadoToDelete?.apellido}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaEmpleados;
