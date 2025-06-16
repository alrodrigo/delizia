import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import agenciaService from '../../services/agenciaService';

const ListaAgenciasResumen = () => {
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agenciaPredeterminada, setAgenciaPredeterminada] = useState('');

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        setLoading(true);
        const response = await agenciaService.getAll();
        setAgencias(response.data || []);
        
        // Verificamos si hay una agencia predeterminada guardada
        const defaultAgencia = localStorage.getItem('agenciaPredeterminada');
        if (defaultAgencia) {
          setAgenciaPredeterminada(defaultAgencia);
        }
      } catch (error) {
        console.error('Error al cargar agencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencias();
  }, []);

  function handleSetDefault(agenciaId) {
    console.log('Setting default agencia:', agenciaId);
    
    try {
      // Establecer directamente en localStorage para simplicidad
      localStorage.setItem('agenciaPredeterminada', agenciaId);
      
      // Actualizar el estado local
      setAgenciaPredeterminada(agenciaId);
      
      console.log('Default agency set successfully:', agenciaId);
    } catch (error) {
      console.error('Error setting default agency:', error);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </CardContent>
      </Card>
    );
  }

  if (agencias.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            No hay agencias registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/agencias/nueva"
          >
            Crear Nueva Agencia
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Agencias</Typography>
          <Button
            size="small"
            component={RouterLink}
            to="/agencias"
            variant="text"
          >
            Ver todas
          </Button>
        </Box>
        <Divider />
        <List sx={{ pt: 0 }}>
          {agencias.slice(0, 5).map((agencia) => (
            <React.Fragment key={agencia._id}>
              <ListItem disablePadding>
                <ListItemText
                  primary={agencia.nombre}
                  secondary={agencia.ciudad}
                  sx={{ my: 1 }}
                />
                <ListItemSecondaryAction>
                  <a 
                    href={`/agencias/editar/${agencia._id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      width: '30px',
                      height: '30px',
                      textDecoration: 'none',
                      marginRight: '8px'
                    }}
                  >
                    ✎
                  </a>
                  <button 
                    onClick={function() {
                      handleSetDefault(agencia._id);
                    }}
                    style={{
                      marginLeft: '8px', 
                      backgroundColor: agenciaPredeterminada === agencia._id ? '#ed6c02' : '#e0e0e0', 
                      color: agenciaPredeterminada === agencia._id ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    ★
                  </button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        {agencias.length > 5 && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/agencias"
              size="small"
            >
              Ver todas ({agencias.length})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ListaAgenciasResumen;
