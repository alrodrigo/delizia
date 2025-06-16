import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import agenciaService from '../../services/agenciaService';

const InfoAgencia = ({ agenciaId }) => {
  const [agencia, setAgencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgencia = async () => {
      if (!agenciaId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await agenciaService.getById(agenciaId);
        setAgencia(response.data);
      } catch (err) {
        console.error('Error al cargar datos de la agencia:', err);
        setError('No se pudo cargar la información de la agencia');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencia();
  }, [agenciaId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!agencia) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Agencia no seleccionada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Por favor, crea o selecciona una agencia.
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            color="primary" 
            component={RouterLink} 
            to="/agencias/nueva"
          >
            Crear Agencia
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Información de Agencia</Typography>
        <Divider sx={{ my: 1.5 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
              {agencia.nombre}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Dirección:
            </Typography>
            <Typography variant="body1">{agencia.direccion}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Ciudad:
            </Typography>
            <Typography variant="body1">{agencia.ciudad}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Teléfono:
            </Typography>
            <Typography variant="body1">{agencia.telefono || 'No disponible'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Encargado:
            </Typography>
            <Typography variant="body1">
              {agencia.encargado ? agencia.encargado.nombre : 'No asignado'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          startIcon={<EditIcon />} 
          component={RouterLink} 
          to={`/agencias/editar/${agencia._id}`}
        >
          Editar
        </Button>
      </CardActions>
    </Card>
  );
};

export default InfoAgencia;
