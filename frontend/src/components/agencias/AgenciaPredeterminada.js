import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import agenciaService from '../../services/agenciaService';

const AgenciaPredeterminada = () => {
  const [agencias, setAgencias] = useState([]);
  const [agenciaPredeterminada, setAgenciaPredeterminada] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        setLoading(true);
        const response = await agenciaService.getAll();
        setAgencias(response.data || []);
        
        // Verificamos si ya hay una agencia predeterminada guardada
        const defaultAgencia = localStorage.getItem('agenciaPredeterminada');
        if (defaultAgencia) {
          setAgenciaPredeterminada(defaultAgencia);
        } else if (response.data && response.data.length > 0) {
          // Si no hay predeterminada pero hay agencias, sugerimos la primera
          setAgenciaPredeterminada(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error al cargar agencias:', error);
        toast.error('Error al cargar la lista de agencias');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencias();
  }, []);

  const handleChange = (event) => {
    setAgenciaPredeterminada(event.target.value);
  };

  function handleSave() {
    console.log('Saving default agency:', agenciaPredeterminada);
    
    if (!agenciaPredeterminada) {
      try {
        toast.warning('Por favor selecciona una agencia predeterminada');
      } catch (e) {
        console.warn('Por favor selecciona una agencia predeterminada');
      }
      return;
    }

    try {
      setSaving(true);
      
      // Guardamos la agencia predeterminada en localStorage
      localStorage.setItem('agenciaPredeterminada', agenciaPredeterminada);
      
      // También la guardamos usando el servicio
      agenciaService.setDefaultAgencia(agenciaPredeterminada);
      
      try {
        toast.success('Agencia predeterminada guardada correctamente');
      } catch (e) {
        console.log('Agencia predeterminada guardada correctamente');
      }
    } catch (error) {
      console.error('Error al guardar agencia predeterminada:', error);
      try {
        toast.error('Error al guardar la agencia predeterminada');
      } catch (e) {
        console.error('Error al guardar la agencia predeterminada');
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (agencias.length === 0) {
    return (
      <Alert severity="warning">
        No hay agencias disponibles. Por favor, crea una agencia primero.
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
          <Typography variant="h6" component="div">
            Agencia Predeterminada
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona la agencia que se usará por defecto al crear nuevos empleados
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="agencia-default-label">Agencia Predeterminada</InputLabel>
          <Select
            labelId="agencia-default-label"
            id="agencia-default"
            value={agenciaPredeterminada}
            label="Agencia Predeterminada"
            onChange={handleChange}
          >
            {agencias.map((agencia) => (
              <MenuItem key={agencia._id} value={agencia._id}>
                {agencia.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button
          onClick={handleSave}
          disabled={saving || !agenciaPredeterminada}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saving || !agenciaPredeterminada ? 'not-allowed' : 'pointer',
            opacity: saving || !agenciaPredeterminada ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {saving ? 'Guardando...' : '★ Establecer como predeterminada'}
        </button>
      </CardContent>
    </Card>
  );
};

export default AgenciaPredeterminada;
