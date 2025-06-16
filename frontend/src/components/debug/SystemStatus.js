import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import empleadoService from '../../services/empleadoService';
import agenciaService from '../../services/agenciaService';
import asistenciaService from '../../services/asistenciaService';
import desempenoService from '../../services/desempenoService';
import { useAuth } from '../../contexts/AuthContext';

const SystemStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState({
    empleados: { loading: true, count: 0, error: null },
    agencias: { loading: true, count: 0, error: null },
    asistencias: { loading: true, count: 0, error: null },
    desempeños: { loading: true, count: 0, error: null }
  });

  useEffect(() => {
    const checkServices = async () => {
      // Test empleados
      try {
        const empleadosData = await empleadoService.getAll();
        setStatus(prev => ({
          ...prev,
          empleados: { 
            loading: false, 
            count: empleadosData.count || empleadosData.data?.length || 0, 
            error: null 
          }
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          empleados: { loading: false, count: 0, error: err.message }
        }));
      }

      // Test agencias
      try {
        const agenciasData = await agenciaService.getAll();
        setStatus(prev => ({
          ...prev,
          agencias: { 
            loading: false, 
            count: agenciasData.count || agenciasData.data?.length || 0, 
            error: null 
          }
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          agencias: { loading: false, count: 0, error: err.message }
        }));
      }

      // Test asistencias
      try {
        const asistenciasData = await asistenciaService.getAll();
        setStatus(prev => ({
          ...prev,
          asistencias: { 
            loading: false, 
            count: asistenciasData.count || asistenciasData.data?.length || 0, 
            error: null 
          }
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          asistencias: { loading: false, count: 0, error: err.message }
        }));
      }

      // Test desempeños
      try {
        const desempeñosData = await desempenoService.getAll();
        setStatus(prev => ({
          ...prev,
          desempeños: { 
            loading: false, 
            count: desempeñosData.count || desempeñosData.data?.length || 0, 
            error: null 
          }
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          desempeños: { loading: false, count: 0, error: err.message }
        }));
      }
    };

    checkServices();
  }, []);

  const getStatusIcon = (service) => {
    if (service.loading) return <CircularProgress size={20} />;
    if (service.error) return <ErrorIcon color="error" />;
    if (service.count > 0) return <CheckIcon color="success" />;
    return <WarningIcon color="warning" />;
  };

  const getStatusChip = (service) => {
    if (service.loading) return <Chip label="Cargando..." color="default" />;
    if (service.error) return <Chip label="Error" color="error" />;
    if (service.count > 0) return <Chip label="Funcionando" color="success" />;
    return <Chip label="Sin datos" color="warning" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Estado del Sistema Delizia
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Usuario actual: {user?.nombre || 'No identificado'} ({user?.email || 'Sin email'})
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Estado de los Servicios
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(status).map(([service, data]) => (
            <Card key={service} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getStatusIcon(data)}
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {service}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({data.count} registros)
                    </Typography>
                  </Box>
                  {getStatusChip(data)}
                </Box>
                {data.error && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Error: {data.error}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Recargar Estado
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SystemStatus;
