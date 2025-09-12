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
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import People from '@mui/icons-material/People';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ];

  const protectedNavItems = [
    { label: 'Disease Classifier', path: '/classifier' },
    { label: 'Advisory System', path: '/advisory' },
    { label: 'System Health', path: '/health' },
  ];

  const navItems = isAuthenticated ? [...publicNavItems, ...protectedNavItems] : publicNavItems;


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    setUserMenuAnchor(null);
    await logout();
    navigate('/');
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
        
        {/* Authentication items in mobile drawer */}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleDrawerToggle}>
                <ListItemText 
                  primary={`Welcome, ${user?.username}`}
                  secondary={user?.email}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-secondary': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/users"
                onClick={handleDrawerToggle}
              >
                <People sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { handleLogout(); handleDrawerToggle(); }}>
                <Logout sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={handleDrawerToggle}
              >
                <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/signup"
                onClick={handleDrawerToggle}
              >
                <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
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
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
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
              
              {/* Authentication buttons for desktop */}
              {isAuthenticated ? (
                <>
               
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{ color: 'inherit', ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: 'inherit',
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="outlined"
                    sx={{
                      color: 'inherit',
                      borderColor: 'rgba(255,255,255,0.5)',
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: '0.9rem',
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
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

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;

