import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Send,
  Agriculture,
  Science,
  CheckCircle,
  Info,
  Mic,
  Stop,
  VolumeUp,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { apiService, ChatMessage } from '../services/api';
import { API_CONFIG } from '../config/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}


const AdvisorySystem: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming advisor. I can help you with cassava disease management, best practices, and farming techniques. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage] = useState<string>(API_CONFIG.DEFAULT_LANGUAGE);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});


  // Fallback responses for when API is unavailable
  const fallbackResponses = [
    "Based on your question about cassava diseases, I recommend implementing regular field monitoring and using certified disease-free planting material. Early detection is crucial for effective management.",
    "For soil fertility, consider incorporating organic matter and practicing crop rotation. Cassava responds well to balanced fertilization, especially with potassium and phosphorus.",
    "When selecting cassava varieties, look for those resistant to common diseases in your area. Local agricultural extension services can provide specific recommendations for your region.",
    "Water management is critical for cassava. While cassava is drought-tolerant, consistent moisture during the first 3-4 months after planting is essential for good root development.",
    "For pest control, consider integrated pest management approaches. This includes cultural practices, biological control, and minimal use of chemical pesticides when necessary."
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated before scrolling
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setIsTyping(true);

    // Add user message to conversation history
    const newUserChatMessage: ChatMessage = {
      role: 'user',
      content: inputText,
    };
    const updatedHistory = [...conversationHistory, newUserChatMessage];
    setConversationHistory(updatedHistory);

    const messageText = inputText;
    setInputText('');

    try {
      // Try to use the context endpoint first (simpler)
      const response = await apiService.getResponseWithContext(
        messageText,
        selectedLanguage
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add AI response to conversation history
      const newAiChatMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
      };
      setConversationHistory(prev => [...prev, newAiChatMessage]);

    } catch (error: unknown) {
      console.error('Chat API error:', error);
      
      // Fallback to mock response if API fails
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setError('Using offline mode. Some features may be limited.');
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      handleSendMessage();
    }
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error: unknown) {
      console.error('Error starting recording:', error);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    setError(null);

    try {
      // Create a File object from the Blob
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

      // Process voice message with context
      const voiceResponse = await apiService.processVoiceMessage(
        audioFile,
        selectedLanguage,
        'cassava farming advisory'
      );

      // Add the transcribed text to input
      setInputText(voiceResponse.user_text);

      // Create audio URL for playback
      const audioUrl = URL.createObjectURL(audioBlob);

      // Add user message with audio
      const userMessage: Message = {
        id: Date.now().toString(),
        text: voiceResponse.user_text,
        isUser: true,
        timestamp: new Date(),
        audioUrl: audioUrl,
      };

      setMessages(prev => [...prev, userMessage]);

      // Add user message to conversation history
      const newUserChatMessage: ChatMessage = {
        role: 'user',
        content: voiceResponse.user_text,
      };
      const updatedHistory = [...conversationHistory, newUserChatMessage];
      setConversationHistory(updatedHistory);

      // Process AI response
      setIsTyping(true);
      
      // Create AI response audio URL if available
      let aiAudioUrl: string | undefined;
      if (voiceResponse.audio_available && voiceResponse.audio_data) {
        try {
          // Convert base64 audio to blob and create URL
          const audioData = atob(voiceResponse.audio_data);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }
          
          const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
          aiAudioUrl = URL.createObjectURL(audioBlob);
        } catch (audioError) {
          console.warn('Failed to process AI audio:', audioError);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: voiceResponse.ai_response,
        isUser: false,
        timestamp: new Date(),
        audioUrl: aiAudioUrl,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add AI response to conversation history
      const newAiChatMessage: ChatMessage = {
        role: 'assistant',
        content: voiceResponse.ai_response,
      };
      setConversationHistory(prev => [...prev, newAiChatMessage]);

      setIsTyping(false);

    } catch (error: unknown) {
      console.error('Voice processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process voice message. Please try again.');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const playAudio = (messageId: string, audioUrl: string) => {
    if (!audioRefs.current[messageId]) {
      const audio = new Audio(audioUrl);
      
      // Add error handling
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio. Please try again.');
        setIsPlayingAudio(null);
      };
      
      audio.onended = () => {
        setIsPlayingAudio(null);
      };
      
      audioRefs.current[messageId] = audio;
    }

    const audio = audioRefs.current[messageId];
    
    if (isPlayingAudio === messageId) {
      audio.pause();
      setIsPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      Object.values(audioRefs.current).forEach(a => a.pause());
      setIsPlayingAudio(messageId);
      
      audio.play().catch((error) => {
        console.error('Audio play error:', error);
        setError('Failed to play audio. Please try again.');
        setIsPlayingAudio(null);
      });
    }
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    setIsGeneratingSpeech(true);
    setError(null);

    try {
      const ttsResponse = await apiService.textToSpeech(text, selectedLanguage);
      
      if (!ttsResponse.audio_data) {
        setError('No audio data received from text-to-speech service.');
        return;
      }
      
      // Convert base64 audio to blob and play
      const audioData = atob(ttsResponse.audio_data);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create a temporary audio element and play
      const audio = new Audio(audioUrl);
      
      // Add error handling for audio playback
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio. Please try again.');
        URL.revokeObjectURL(audioUrl); // Clean up the URL
        setIsGeneratingSpeech(false);
      };
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up the URL when done
        setIsGeneratingSpeech(false);
      };
      
      await audio.play();
      
    } catch (error: unknown) {
      console.error('TTS error:', error);
      setError('Failed to generate speech. Please try again.');
      setIsGeneratingSpeech(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      {/* Fixed Navbar */}
      

      {/* Main Content */}
      <Box sx={{ 
        mt: { xs: '70px', sm: '80px' }, 
        flex: 1, 
        p: { xs: 1, sm: 2, md: 3 },
        pb: { xs: 2, sm: 3 }
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 4 }, 
            maxWidth: 800, 
            mx: 'auto',
            px: { xs: 1, sm: 0 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Get personalized advice on cassava farming, disease management, and best practices. 
          Ask me anything about cassava cultivation!
        </Typography>

        <Box sx={{ 
          maxWidth: '1000px', 
          mx: 'auto', 
          height: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 200px)' }
        }}>
          {/* Chat Interface */}
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 3 }, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: { xs: 2, sm: 3 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Chat with AI Advisor
              </Typography>
            </Box>

            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Messages Area */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              mb: { xs: 2, sm: 3 }, 
              p: { xs: 1.5, sm: 2 }, 
              backgroundColor: 'grey.50', 
              borderRadius: 2 
            }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: { xs: '85%', sm: '70%' },
                      backgroundColor: message.isUser ? 'primary.main' : 'white',
                      color: message.isUser ? 'white' : 'text.primary',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      boxShadow: 1,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.4
                      }}
                    >
                      {message.text}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      mt: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 0.5, sm: 0 }
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 1 }, 
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {message.audioUrl && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={isPlayingAudio === message.id ? <Pause /> : <PlayArrow />}
                            onClick={() => playAudio(message.id, message.audioUrl!)}
                            sx={{ 
                              minWidth: 'auto', 
                              px: { xs: 0.5, sm: 1 },
                              py: { xs: 0.5, sm: 0.5 },
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              minHeight: { xs: 28, sm: 32 },
                              color: message.isUser ? 'white' : 'primary.main',
                              borderColor: message.isUser ? 'white' : 'primary.main',
                              '&:hover': {
                                borderColor: message.isUser ? 'white' : 'primary.main',
                                backgroundColor: message.isUser ? 'rgba(255,255,255,0.1)' : 'primary.50',
                              }
                            }}
                          >
                            {isPlayingAudio === message.id ? 'Pause' : 'Play'}
                          </Button>
                        )}
                        {!message.isUser && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={isGeneratingSpeech ? <CircularProgress size={16} /> : <VolumeUp />}
                            onClick={() => speakText(message.text)}
                            disabled={isGeneratingSpeech}
                            sx={{ 
                              minWidth: 'auto', 
                              px: { xs: 0.5, sm: 1 },
                              py: { xs: 0.5, sm: 0.5 },
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              minHeight: { xs: 28, sm: 32 },
                              color: isGeneratingSpeech ? 'grey.500' : 'primary.main',
                              borderColor: isGeneratingSpeech ? 'grey.300' : 'primary.main',
                              '&:hover': {
                                borderColor: isGeneratingSpeech ? 'grey.300' : 'primary.main',
                                backgroundColor: isGeneratingSpeech ? 'transparent' : 'primary.50',
                              }
                            }}
                          >
                            {isGeneratingSpeech ? 'Generating...' : 'Speak'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">AI is typing...</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box 
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              sx={{ 
                display: 'flex', 
                gap: { xs: 0.5, sm: 1 }, 
                alignItems: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about cassava farming, diseases, or best practices..."
                variant="outlined"
                size="small"
                disabled={isRecording || isProcessingVoice}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    minHeight: { xs: 40, sm: 40 }
                  }
                }}
              />
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 0.5, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'flex-end', sm: 'flex-start' }
              }}>
                {!isRecording ? (
                  <Button
                    variant="outlined"
                    onClick={startVoiceRecording}
                    disabled={isTyping || isProcessingVoice}
                    sx={{ 
                      minWidth: { xs: 44, sm: 50 }, 
                      height: { xs: 44, sm: 40 },
                      minHeight: { xs: 44, sm: 40 },
                      borderColor: isProcessingVoice ? 'grey.300' : 'primary.main',
                      color: isProcessingVoice ? 'grey.500' : 'primary.main',
                      '&:hover': {
                        backgroundColor: isProcessingVoice ? 'transparent' : 'primary.50',
                      }
                    }}
                    title="Start voice recording"
                  >
                    {isProcessingVoice ? <CircularProgress size={20} /> : <Mic />}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={stopVoiceRecording}
                    color="error"
                    sx={{ 
                      minWidth: { xs: 44, sm: 50 }, 
                      height: { xs: 44, sm: 40 },
                      minHeight: { xs: 44, sm: 40 }
                    }}
                    title="Stop voice recording"
                  >
                    <Stop />
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  disabled={!inputText.trim() || isTyping || isRecording || isProcessingVoice}
                  sx={{ 
                    minWidth: { xs: 44, sm: 50 }, 
                    height: { xs: 44, sm: 40 },
                    minHeight: { xs: 44, sm: 40 }
                  }}
                  title="Send message"
                >
                  <Send />
                </Button>
              </Box>
            </Box>
            
            {/* Voice Recording Status */}
            {isRecording && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 1, 
                p: { xs: 0.75, sm: 1 }, 
                backgroundColor: 'error.50', 
                borderRadius: 1 
              }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  backgroundColor: 'error.main', 
                  borderRadius: '50%', 
                  animation: 'pulse 1.5s infinite' 
                }} />
                <Typography 
                  variant="body2" 
                  color="error.main"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Recording... Click stop when finished
                </Typography>
              </Box>
            )}
            
            {isProcessingVoice && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 1, 
                p: { xs: 0.75, sm: 1 }, 
                backgroundColor: 'info.50', 
                borderRadius: 1 
              }}>
                <CircularProgress size={16} />
                <Typography 
                  variant="body2" 
                  color="info.main"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Processing voice message...
                </Typography>
              </Box>
            )}
            
            {isGeneratingSpeech && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 1, 
                p: { xs: 0.75, sm: 1 }, 
                backgroundColor: 'primary.50', 
                borderRadius: 1 
              }}>
                <CircularProgress size={16} />
                <Typography 
                  variant="body2" 
                  color="primary.main"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Generating speech...
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Tips Section */}
        <Paper elevation={2} sx={{ 
          p: { xs: 2, sm: 3 }, 
          mt: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              mb: { xs: 1.5, sm: 2 }, 
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Getting the Most from Your AI Advisor
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: { xs: 1.5, sm: 2 }
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Info sx={{ fontSize: { xs: 24, sm: 32 }, color: 'info.main', mb: 1 }} />
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Be Specific
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
              >
                Ask detailed questions about your specific situation for better advice
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Agriculture sx={{ fontSize: { xs: 24, sm: 32 }, color: 'primary.main', mb: 1 }} />
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Local Context
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
              >
                Mention your location and climate for region-specific recommendations
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: { xs: 24, sm: 32 }, color: 'success.main', mb: 1 }} />
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Follow Up
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
              >
                Ask follow-up questions to clarify and get more detailed information
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Science sx={{ fontSize: { xs: 24, sm: 32 }, color: 'secondary.main', mb: 1 }} />
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Best Practices
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
              >
                Request step-by-step guidance for implementing recommendations
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdvisorySystem;
