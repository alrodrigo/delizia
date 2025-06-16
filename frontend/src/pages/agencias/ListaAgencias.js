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
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import agenciaService from '../../services/agenciaService';

const ListaAgencias = () => {
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAgencias, setTotalAgencias] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agenciaToDelete, setAgenciaToDelete] = useState(null);

  const fetchAgencias = async () => {
    try {
      setLoading(true);
      const response = await agenciaService.getAll();
      
      let filteredAgencias = response.data || [];
      
      // Filtrar por búsqueda si hay un término
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredAgencias = filteredAgencias.filter(agencia => 
          agencia.nombre.toLowerCase().includes(lowerSearchTerm) ||
          agencia.ciudad.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // Aplicar paginación manual (ya que el backend no la implementa para agencias)
      setTotalAgencias(filteredAgencias.length);
      
      const startIndex = page * rowsPerPage;
      const paginatedAgencias = filteredAgencias.slice(startIndex, startIndex + rowsPerPage);
      
      setAgencias(paginatedAgencias);
    } catch (error) {
      console.error('Error al obtener agencias:', error);
      toast.error('Error al cargar la lista de agencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencias();
  }, [page, rowsPerPage, searchTerm]);

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

  const handleDeleteClick = (agencia) => {
    setAgenciaToDelete(agencia);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agenciaToDelete) return;
    
    try {
      await agenciaService.delete(agenciaToDelete._id);
      toast.success(`Agencia ${agenciaToDelete.nombre} eliminada correctamente`);
      fetchAgencias();
    } catch (error) {
      console.error('Error al eliminar agencia:', error);
      toast.error('Error al eliminar la agencia');
    } finally {
      setDeleteDialogOpen(false);
      setAgenciaToDelete(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Agencias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/agencias/nueva"
        >
          Nueva Agencia
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Buscar por nombre o ciudad"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Encargado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : agencias.length > 0 ? (
              agencias.map((agencia) => (
                <TableRow key={agencia._id}>
                  <TableCell>{agencia.nombre}</TableCell>
                  <TableCell>{agencia.direccion}</TableCell>
                  <TableCell>{agencia.ciudad}</TableCell>
                  <TableCell>{agencia.telefono || 'N/A'}</TableCell>
                  <TableCell>{agencia.encargado ? `${agencia.encargado.nombre}` : 'No asignado'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      component={RouterLink} 
                      to={`/agencias/editar/${agencia._id}`}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteClick(agencia)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LocationCityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron agencias
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      component={RouterLink}
                      to="/agencias/nueva"
                      sx={{ mt: 2 }}
                    >
                      Crear Nueva Agencia
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalAgencias}
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
            ¿Estás seguro de que quieres eliminar la agencia {agenciaToDelete?.nombre}? Esta acción no se puede deshacer.
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

export default ListaAgencias;
