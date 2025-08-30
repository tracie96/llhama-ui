import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Disease Classifier', path: '/classifier' },
    { label: 'Advisory System', path: '/advisory' },
    { label: 'About', path: '/about' },
  ];

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <AgricultureIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Cassava Disease Classifier
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

