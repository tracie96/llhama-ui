import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Agriculture,
  Psychology,
  Science,
  TrendingUp,
  People,
  Security,
  Accessibility,
  Support,
  CheckCircle,
} from '@mui/icons-material';

const About: React.FC = () => {
  const features = [
    {
      icon: <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms trained on extensive cassava disease datasets for accurate identification.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Intelligent Advisory',
      description: 'LLM-based recommendation system providing personalized farming advice and disease management strategies.',
    },
    {
      icon: <Science sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Scientific Accuracy',
      description: 'Built on research from leading agricultural institutions and validated by farming experts.',
    },
    {
      icon: <Accessibility sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Farmer-Friendly',
      description: 'Simple interface designed for farmers of all technical levels, with local language support.',
    },
  ];

  const benefits = [
    'Early disease detection prevents widespread crop damage',
    'Reduces dependency on expensive laboratory testing',
    'Provides instant access to expert farming knowledge',
    'Helps farmers make informed decisions quickly',
    'Contributes to sustainable farming practices',
    'Improves food security in cassava-growing regions',
  ];

  const technology = [
    'Convolutional Neural Networks (CNN) for image analysis',
    'Transfer learning from pre-trained models',
    'Natural Language Processing for advisory system',
    'Mobile-first responsive design',
    'Offline capability for areas with limited connectivity',
    'Multi-language support for local communities',
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        About the Project
      </Typography>

      {/* Mission Statement */}
      <Paper elevation={3} sx={{ p: 6, mb: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}>
          To empower smallholder cassava farmers with cutting-edge AI technology, enabling early disease detection, 
          informed decision-making, and improved crop yields. We believe that technology should be accessible to all 
          farmers, regardless of their location or technical expertise.
        </Typography>
      </Paper>

      {/* Key Features */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Technology Features
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

      {/* Project Overview */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 6 }}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              Project Overview
            </Typography>
            <Typography variant="body1" paragraph>
              This MVP represents the first step in our vision to democratize agricultural technology. 
              The Cassava Disease Classifier combines computer vision with machine learning to identify 
              common cassava diseases from simple smartphone photos.
            </Typography>
            <Typography variant="body1" paragraph>
              Our advisory system leverages large language models to provide contextual, location-specific 
              farming advice, helping farmers implement best practices and make informed decisions about 
              their crops.
            </Typography>
            <Typography variant="body1">
              The system is designed to work in challenging environments with limited internet connectivity 
              and is optimized for mobile devices commonly used by farmers.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'secondary.main' }}>
              Expected Impact
            </Typography>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

      {/* Technology Stack */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Technology Stack
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Frontend & UI
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Built with React and TypeScript for robust, maintainable code. Material-UI provides 
              a professional, accessible design system that works across all devices.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              AI & Machine Learning
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Convolutional Neural Networks trained on extensive cassava disease datasets. 
              Transfer learning ensures high accuracy even with limited training data.
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Key Technical Features:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {technology.map((tech, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{tech}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Development Team */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Development Approach
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>User-Centered Design</Typography>
            <Typography variant="body2" color="text.secondary">
              Developed with extensive input from farmers and agricultural experts to ensure 
              the solution meets real-world needs.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Security sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Data Privacy</Typography>
            <Typography variant="body2" color="text.secondary">
              All farmer data is processed locally when possible, with strict privacy controls 
              for any cloud-based processing.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Support sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Continuous Improvement</Typography>
            <Typography variant="body2" color="text.secondary">
              Regular updates based on user feedback and new research findings to improve 
              accuracy and user experience.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Future Roadmap */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Future Roadmap
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Phase 2: Enhanced Features
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Multi-crop disease detection" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Weather integration for disease prediction" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Community knowledge sharing platform" />
              </ListItem>
            </List>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Phase 3: Advanced Analytics
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Yield prediction models" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Market price integration" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Advanced soil health analysis" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default About;
