import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Disease Classifier', path: '/classifier' },
    { label: 'Advisory System', path: '/advisory' },
    { label: 'System Health', path: '/health' },
    { label: 'About', path: '/about' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid rgba(0,0,0,0.1)' 
      }}>
        <AgricultureIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Cassava AI
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ ml: 'auto' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: location.pathname === item.path ? 'primary.50' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid' : '4px solid transparent',
                borderLeftColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.50',
                },
              }}
            >
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      elevation={2}
      sx={{
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '& .MuiToolbar-root': {
          borderRadius: 0,
        }
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AgricultureIcon sx={{ 
              mr: { xs: 1, sm: 2 }, 
              fontSize: { xs: 24, sm: 32 } 
            }} />
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '1.25rem' },
                lineHeight: 1.2,
              }}
            >
              {isMobile ? 'Cassava AI' : 'Cassava Disease Classifier'}
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                    borderRadius: 0,
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 0,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;

