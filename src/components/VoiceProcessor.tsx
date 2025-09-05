import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  CloudUpload,
  VolumeUp,
  CheckCircle,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { apiService } from '../services/api';
import { API_CONFIG } from '../config/api';

interface VoiceProcessorProps {
  onTranscription?: (text: string) => void;
  onResponse?: (response: string) => void;
  diseaseContext?: string;
  className?: string;
}

const VoiceProcessor: React.FC<VoiceProcessorProps> = ({
  onTranscription,
  onResponse,
  diseaseContext,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(API_CONFIG.DEFAULT_LANGUAGE);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [responseAudioUrl, setResponseAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const responseAudioRef = useRef<HTMLAudioElement | null>(null);

  // Process audio file
  const processAudioFile = useCallback(async (audioFile: File | Blob) => {
    setIsProcessing(true);
    setError(null);
    setTranscription(null);
    setResponse(null);

    try {
      // Create a File object if it's a Blob
      const file = audioFile instanceof File ? audioFile : new File([audioFile], 'recording.wav', { type: 'audio/wav' });

      // Process voice message with context
      const voiceResponse = await apiService.processVoiceMessage(
        file,
        selectedLanguage,
        diseaseContext
      );

      setTranscription(voiceResponse.transcription);
      setResponse(voiceResponse.response);

      // Handle audio response if available
      if (voiceResponse.audio_data) {
        try {
          // Convert base64 audio to blob and create URL
          const audioData = atob(voiceResponse.audio_data);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }
          
          const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setResponseAudioUrl(audioUrl);
        } catch (audioError) {
          console.error('Error processing audio response:', audioError);
        }
      }

      // Call callbacks if provided
      if (onTranscription) {
        onTranscription(voiceResponse.transcription);
      }
      if (onResponse) {
        onResponse(voiceResponse.response);
      }

    } catch (error: unknown) {
      console.error('Voice processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedLanguage, diseaseContext, onTranscription, onResponse]);

  // Audio recording functions
  const startRecording = async () => {
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
        processAudioFile(audioBlob);
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!API_CONFIG.SUPPORTED_AUDIO_TYPES.includes(file.type as any)) {
      setError('Please upload a supported audio file (WAV, MP3, OGG)');
      return;
    }
    
    // Validate file size
    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      setError('File size too large. Please upload an audio file smaller than 10MB');
      return;
    }
    
    processAudioFile(file);
  }, [processAudioFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.ogg']
    },
    multiple: false
  });


  // Text-to-speech
  const speakText = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsProcessing(true);
      const ttsResponse = await apiService.textToSpeech(text, selectedLanguage);
      
      // Convert base64 audio to blob and play
      const audioData = atob(ttsResponse.audio_data);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
      
    } catch (error: unknown) {
      console.error('TTS error:', error);
      setError('Failed to generate speech. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Play response audio
  const playResponseAudio = () => {
    if (responseAudioUrl && responseAudioRef.current) {
      responseAudioRef.current.src = responseAudioUrl;
      responseAudioRef.current.play();
      setIsPlayingResponse(true);
      
      responseAudioRef.current.onended = () => {
        setIsPlayingResponse(false);
      };
    }
  };

  const stopResponseAudio = () => {
    if (responseAudioRef.current) {
      responseAudioRef.current.pause();
      responseAudioRef.current.currentTime = 0;
      setIsPlayingResponse(false);
    }
  };

  return (
    <Box className={className}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Voice Processing
        </Typography>

        {/* Language Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={selectedLanguage}
            label="Language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {API_CONFIG.SUPPORTED_LANGUAGES.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Recording Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
          {!isRecording ? (
            <Button
              variant="contained"
              startIcon={<Mic />}
              onClick={startRecording}
              disabled={isProcessing}
              color="primary"
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Stop />}
              onClick={stopRecording}
              color="error"
            >
              Stop Recording
            </Button>
          )}
        </Box>

        {/* File Upload */}
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
            transition: 'all 0.3s ease',
            mb: 3,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop the audio file here' : 'Drag & drop an audio file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Supports: WAV, MP3, OGG (Max 10MB)
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">
              Processing audio...
            </Typography>
          </Box>
        )}

        {/* Results */}
        {transcription && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Transcription
                </Typography>
                <Chip
                  label="Transcribed"
                  color="success"
                  icon={<CheckCircle />}
                  size="small"
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {transcription}
              </Typography>
              <Button
                variant="outlined"
                startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                onClick={() => isPlaying ? stopAudio() : speakText(transcription)}
                disabled={isProcessing}
                size="small"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            </CardContent>
          </Card>
        )}

        {response && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  AI Response
                </Typography>
                <Chip
                  label="Generated"
                  color="primary"
                  icon={<VolumeUp />}
                  size="small"
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {response}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {responseAudioUrl && (
                  <Button
                    variant="contained"
                    startIcon={isPlayingResponse ? <Pause /> : <PlayArrow />}
                    onClick={() => isPlayingResponse ? stopResponseAudio() : playResponseAudio()}
                    disabled={isProcessing}
                    size="small"
                    color="primary"
                  >
                    {isPlayingResponse ? 'Pause Audio' : 'Play Audio Response'}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                  onClick={() => isPlaying ? stopAudio() : speakText(response)}
                  disabled={isProcessing}
                  size="small"
                >
                  {isPlaying ? 'Pause TTS' : 'Generate TTS'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Hidden audio elements */}
        <audio ref={audioRef} />
        <audio ref={responseAudioRef} />
      </Paper>
    </Box>
  );
};

export default VoiceProcessor;
