import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Refresh,
  HealthAndSafety,
  Psychology,
  CameraAlt,
  VolumeUp,
} from '@mui/icons-material';
import { apiService, HealthCheckResponse, SupportedLanguagesResponse } from '../services/api';

interface SystemHealthProps {
  className?: string;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ className }) => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [languagesData, setLanguagesData] = useState<SupportedLanguagesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [healthResponse, languagesResponse] = await Promise.all([
        apiService.getHealthCheck(),
        apiService.getSupportedLanguages(),
      ]);

      setHealthData(healthResponse);
      setLanguagesData(languagesResponse);
      setLastUpdated(new Date());
    } catch (error: unknown) {
      console.error('Health check error:', error);
      setError(error instanceof Error ? String((error as Error).message) : 'Failed to fetch system health data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // Refresh health data every 5 minutes
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'unhealthy':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
      case 'unhealthy':
        return <Error />;
      default:
        return <HealthAndSafety />;
    }
  };

  const serviceIcons: Record<string, React.ReactNode> = {
    classification: <CameraAlt />,
    chat: <Psychology />,
    voice: <VolumeUp />,
    database: <HealthAndSafety />,
  };

  return (
    <Box className={className}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">
            System Health Status
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchHealthData}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2">Checking system health...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {healthData && (
          <Box sx={{ display: 'grid', gap: 3 }}>
            {/* Overall Status */}
            <Box>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon(healthData.status)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Overall System Status
                    </Typography>
                    <Chip
                      label={healthData.status}
                      color={getStatusColor(healthData.status) as any}
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Version: {healthData.version}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Check: {lastUpdated?.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Service Status */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Service Status
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {Object.entries(healthData.services).map(([service, isHealthy]) => (
                  <Box key={service}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {serviceIcons[service] || <HealthAndSafety />}
                          <Typography variant="body2" sx={{ ml: 1, flexGrow: 1, textTransform: 'capitalize' }}>
                            {service.replace('_', ' ')}
                          </Typography>
                          <Chip
                            label={isHealthy ? 'Healthy' : 'Unhealthy'}
                            color={isHealthy ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Supported Languages */}
            {languagesData && languagesData.success && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Supported Languages
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Text Languages ({languagesData.text_languages.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {languagesData.text_languages.slice(0, 8).map((lang) => (
                            <Chip key={lang} label={lang} size="small" variant="outlined" />
                          ))}
                          {languagesData.text_languages.length > 8 && (
                            <Chip 
                              label={`+${languagesData.text_languages.length - 8} more`} 
                              size="small" 
                              variant="outlined" 
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                  <Box>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Voice Languages ({languagesData.voice_languages.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {languagesData.voice_languages.slice(0, 8).map((lang) => (
                            <Chip key={lang} label={lang} size="small" variant="outlined" />
                          ))}
                          {languagesData.voice_languages.length > 8 && (
                            <Chip 
                              label={`+${languagesData.voice_languages.length - 8} more`} 
                              size="small" 
                              variant="outlined" 
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {lastUpdated && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Last updated: {lastUpdated.toLocaleString()}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SystemHealth;
