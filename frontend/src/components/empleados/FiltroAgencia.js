import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import agenciaService from '../../services/agenciaService';
import { toast } from 'react-toastify';

const FiltroAgencia = ({ onAgenciaChange, selectedAgencia }) => {
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        setLoading(true);
        const response = await agenciaService.getAll();
        setAgencias(response.data || []);
        
        // Si no hay agencia seleccionada pero hay una predeterminada, la seleccionamos
        if (!selectedAgencia) {
          const defaultAgencia = agenciaService.getDefaultAgencia();
          if (defaultAgencia && onAgenciaChange) {
            onAgenciaChange(defaultAgencia);
          }
        }
      } catch (error) {
        console.error('Error al cargar agencias:', error);
        toast.error('Error al cargar la lista de agencias');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencias();
  }, [selectedAgencia, onAgenciaChange]);

  const handleChange = (event) => {
    if (onAgenciaChange) {
      onAgenciaChange(event.target.value);
    }
  };

  const getAgenciaNombre = () => {
    const agencia = agencias.find(a => a._id === selectedAgencia);
    return agencia ? agencia.nombre : 'Todas las agencias';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Cargando agencias...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <BusinessIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Filtrar por Agencia</Typography>
        </Box>
        
        {selectedAgencia && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Agencia seleccionada:
            </Typography>
            <Chip 
              label={getAgenciaNombre()} 
              color="primary" 
              sx={{ mt: 0.5 }}
            />
          </Box>
        )}

        <FormControl fullWidth variant="outlined">
          <InputLabel id="agencia-selector-label">Agencia</InputLabel>
          <Select
            labelId="agencia-selector-label"
            id="agencia-selector"
            value={selectedAgencia || ''}
            onChange={handleChange}
            label="Agencia"
          >
            <MenuItem value="">
              <em>Todas las agencias</em>
            </MenuItem>
            {agencias.map((agencia) => (
              <MenuItem key={agencia._id} value={agencia._id}>
                {agencia.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default FiltroAgencia;
