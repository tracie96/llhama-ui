import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import VoiceProcessor from '../components/VoiceProcessor';

const VoiceAssistant: React.FC = () => {
  const handleTranscription = (text: string) => {
    // Handle transcription if needed in the future
    console.log('Transcription received:', text);
  };

  const handleResponse = (text: string) => {
    // Handle response if needed in the future
    console.log('Response received:', text);
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Voice Assistant
        </Typography>
        
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}>
          Interact with our AI assistant using voice commands. Record your questions about cassava farming, 
          disease management, or best practices, and get spoken responses in your preferred language.
        </Typography>

        <VoiceProcessor
          onTranscription={handleTranscription}
          onResponse={handleResponse}
          className="voice-assistant"
        />

        {/* Tips Section */}
        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            Tips for Best Voice Experience
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Clear Speech</Typography>
              <Typography variant="body2" color="text.secondary">
                Speak clearly and at a moderate pace for better transcription accuracy
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Quiet Environment</Typography>
              <Typography variant="body2" color="text.secondary">
                Record in a quiet environment to minimize background noise interference
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Specific Questions</Typography>
              <Typography variant="body2" color="text.secondary">
                Ask specific questions about cassava farming for more targeted responses
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Language Support</Typography>
              <Typography variant="body2" color="text.secondary">
                Select your preferred language for both input and output processing
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VoiceAssistant;
