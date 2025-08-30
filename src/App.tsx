import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Home from './pages/Home';
import DiseaseClassifier from './pages/DiseaseClassifier';
import AdvisorySystem from './pages/AdvisorySystem';
import About from './pages/About';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for agriculture theme
    },
    secondary: {
      main: '#ff9800', // Orange color for cassava theme
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2e7d32',
    },
    h5: {
      fontWeight: 500,
      color: '#2e7d32',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Header />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/classifier" element={<DiseaseClassifier />} />
              <Route path="/advisory" element={<AdvisorySystem />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
