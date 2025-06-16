import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const UserDebug = () => {
  const { user } = useAuth();
  
  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6">Debug - Usuario Actual:</Typography>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Typography>Token: {localStorage.getItem('delizia_token')?.substring(0, 50)}...</Typography>
    </Paper>
  );
};

export default UserDebug;
