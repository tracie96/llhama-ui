import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CameraAlt,
  Psychology,
  Agriculture,
  TrendingUp,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CameraAlt sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Disease Detection',
      description: 'Upload or capture images of cassava leaves to instantly identify diseases using our AI-powered classifier.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Smart Recommendations',
      description: 'Receive personalized advice and treatment recommendations based on detected diseases.',
    },
    {
      icon: <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Farmer Advisory',
      description: 'Get expert guidance on best practices, resistant varieties, and agronomic techniques.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Improved Yields',
      description: 'Early disease detection and proper management lead to better crop outcomes and reduced losses.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 6,
          mb: 6,
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Cassava Disease Classifier
        </Typography>
        <Typography variant="body1" component="h2" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
          AI-Powered Disease Detection & Farmer Advisory System
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
          Empowering smallholder cassava farmers with cutting-edge technology to identify diseases early 
          and receive actionable recommendations for better crop management.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/classifier')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            Start Disease Detection
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/advisory')}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Get Expert Advice
          </Button>
        </Box>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Key Features
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 6 }}>
        {features.map((feature, index) => (
          <Card
            key={index}
            elevation={2}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              p: 2,
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* How It Works Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          How It Works
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" sx={{ color: 'primary.main', mb: 2 }}>1</Typography>
            <Typography variant="h6" gutterBottom>Upload Image</Typography>
            <Typography variant="body2" color="text.secondary">
              Take a photo or upload an image of your cassava leaves
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" sx={{ color: 'primary.main', mb: 2 }}>2</Typography>
            <Typography variant="h6" gutterBottom>AI Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Our machine learning model analyzes the image for disease symptoms
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" sx={{ color: 'primary.main', mb: 2 }}>3</Typography>
            <Typography variant="h6" gutterBottom>Get Results</Typography>
            <Typography variant="body2" color="text.secondary">
              Receive instant diagnosis and personalized recommendations
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* CTA Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Protect Your Cassava Crop?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Join thousands of farmers who are already using our system to improve their yields and reduce crop losses.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/classifier')}
          sx={{
            backgroundColor: 'white',
            color: 'secondary.main',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Start Now - It's Free!
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
