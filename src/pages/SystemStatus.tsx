import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';
import SystemHealth from '../components/SystemHealth';

const SystemStatus: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          System Status & Health
        </Typography>
        
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}>
          Monitor the health and status of all system services, including disease classification, 
          chat functionality, voice processing, and supported languages.
        </Typography>

        <SystemHealth className="system-health" />
      </Box>
    </Container>
  );
};

export default SystemStatus;
