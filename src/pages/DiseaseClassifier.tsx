import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Slide,
  Zoom,
  Container,
  Grid,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  CloudUpload,
  CameraAlt,
  CheckCircle,
  Warning,
  Info,
  AutoAwesome,
  Science,
  Agriculture,
  HealthAndSafety,
} from '@mui/icons-material';
import { apiService, DiseaseClassificationResponse } from '../services/api';
import { API_CONFIG } from '../config/api';

// Remove the old interface since we're using the API interface now

const DiseaseClassifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DiseaseClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(API_CONFIG.DEFAULT_LANGUAGE);

  // Fallback data for when API doesn't provide complete information
  const getFallbackData = (disease: string) => {
    const fallbackData: Record<string, { description: string; symptoms: string[]; recommendations: string[] }> = {
      'Cassava Mosaic Disease (CMD)': {
        description: 'A viral disease caused by cassava mosaic viruses that affects the leaves and reduces yield.',
        symptoms: ['Mosaic patterns on leaves', 'Leaf distortion', 'Stunted growth', 'Reduced tuber size'],
        recommendations: [
          'Remove and destroy infected plants',
          'Use virus-free planting material',
          'Control whitefly vectors',
          'Plant resistant varieties',
          'Practice crop rotation'
        ]
      },
      'Cassava Brown Streak Disease (CBSD)': {
        description: 'A viral disease that causes brown streaks in the roots and can lead to complete crop failure.',
        symptoms: ['Brown streaks in roots', 'Yellow leaf spots', 'Root rot', 'Reduced starch content'],
        recommendations: [
          'Use certified disease-free cuttings',
          'Implement strict quarantine measures',
          'Control whitefly populations',
          'Harvest early before symptoms appear',
          'Plant tolerant varieties'
        ]
      },
      'Cassava Bacterial Blight (CBB)': {
        description: 'A bacterial disease that causes wilting and cankers on stems and leaves.',
        symptoms: ['Water-soaked leaf spots', 'Stem cankers', 'Wilting', 'Dieback'],
        recommendations: [
          'Remove infected plant parts',
          'Avoid overhead irrigation',
          'Use disease-free planting material',
          'Apply copper-based fungicides',
          'Practice field sanitation'
        ]
      },
      'Cassava Blight': {
        description: 'A fungal disease that causes leaf spots and can lead to significant yield loss.',
        symptoms: ['Brown or black spots on leaves', 'Leaf yellowing', 'Premature leaf drop', 'Reduced photosynthesis'],
        recommendations: [
          'Remove and destroy infected plant debris',
          'Improve air circulation around plants',
          'Apply fungicides as recommended',
          'Avoid overhead watering',
          'Plant resistant varieties when available'
        ]
      },
      'Healthy Cassava': {
        description: 'Your cassava plants appear to be healthy with no visible disease symptoms.',
        symptoms: ['Normal green leaves', 'Healthy stem growth', 'Proper leaf development'],
        recommendations: [
          'Continue current management practices',
          'Monitor regularly for early signs of disease',
          'Maintain good soil fertility',
          'Practice crop rotation',
          'Keep field clean and weed-free'
        ]
      }
    };
    
    return fallbackData[disease] || {
      description: 'Disease classification completed.',
      symptoms: ['Please consult with a local agricultural expert for detailed symptoms'],
      recommendations: ['Contact your local agricultural extension service for specific recommendations']
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setResults(null);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!API_CONFIG.SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
      setError('Please upload a supported image file (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size
    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      setError('File size too large. Please upload an image smaller than 10MB');
      return;
    }
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await apiService.classifyImage(selectedFile, selectedLanguage);
      
      // Use predicted_class as the disease name, fallback to disease field for backward compatibility
      const diseaseName = response.predicted_class || response.disease || 'Unknown Disease';
      
      // Enhance response with fallback data if needed
      const enhancedResponse: DiseaseClassificationResponse = {
        ...response,
        disease: diseaseName, // Ensure disease field is populated for backward compatibility
        description: response.description || getFallbackData(diseaseName).description,
        symptoms: response.symptoms || getFallbackData(diseaseName).symptoms,
        recommendations: response.recommendations || getFallbackData(diseaseName).recommendations,
      };
      
      setResults(enhancedResponse);
    } catch (error: unknown) {
      console.error('Classification error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResults(null);
    setError(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
    <Box>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Science sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                AI Disease Classifier
      </Typography>
              <AutoAwesome sx={{ fontSize: 48, color: 'secondary.main' }} />
            </Stack>
            
            <Typography variant="h6" sx={{ 
              color: 'text.secondary', 
              maxWidth: 600, 
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6
            }}>
        Upload a clear image of your cassava leaves to detect diseases and receive personalized recommendations 
        for treatment and management.
      </Typography>

            {/* Feature Pills */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip 
                icon={<Agriculture />} 
                label="Agricultural AI" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                icon={<HealthAndSafety />} 
                label="Disease Detection" 
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                icon={<AutoAwesome />} 
                label="Instant Results" 
                color="secondary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Stack>
          </Box>

          <Grid container spacing={4}>
        {/* Image Upload Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide in timeout={1000} direction="right">
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #ff9800 100%)',
                    }
                  }}
                >
                  <Stack spacing={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: 'text.primary'
                      }}>
              Upload Cassava Leaf Image
            </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get instant AI-powered disease analysis
                      </Typography>
                    </Box>
            
            {/* Language Selection */}
                    <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
              >
                {API_CONFIG.SUPPORTED_LANGUAGES.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                        borderRadius: 3,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                        background: isDragActive 
                          ? 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                '&:hover': {
                  borderColor: 'primary.main',
                          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(76, 175, 80, 0.08) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0px 8px 25px rgba(46, 125, 50, 0.15)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                },
              }}
            >
              <input {...getInputProps()} />
              {selectedImage ? (
                        <Zoom in timeout={500}>
                <Box>
                            <Box sx={{ 
                              position: 'relative',
                              borderRadius: 3,
                              overflow: 'hidden',
                              mb: 3,
                              boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
                            }}>
                  <img
                    src={selectedImage}
                    alt="Selected cassava leaf"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                                  width: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                              <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'rgba(0,0,0,0.7)',
                                borderRadius: 2,
                                p: 1,
                                color: 'white',
                              }}>
                                <CameraAlt sx={{ fontSize: 20 }} />
                              </Box>
                            </Box>
                            <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAnalysis();
                    }}
                                sx={{ 
                                  minWidth: 120,
                                  borderRadius: 2,
                                }}
                  >
                                Remove
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeImage();
                    }}
                    disabled={isAnalyzing}
                                startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Science />}
                                sx={{ 
                                  minWidth: 140,
                                  borderRadius: 2,
                                }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                            </Stack>
                </Box>
                        </Zoom>
              ) : (
                <Box>
                          <Box sx={{ 
                            position: 'relative',
                            display: 'inline-block',
                            mb: 2,
                          }}>
                            <CloudUpload sx={{ 
                              fontSize: 80, 
                              color: 'primary.main',
                              filter: 'drop-shadow(0px 4px 8px rgba(46, 125, 50, 0.3))',
                            }} />
                            <Box sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' },
                              }
                            }}>
                              <AutoAwesome sx={{ fontSize: 14, color: 'white' }} />
                            </Box>
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click to select a file
                  </Typography>
                          <Chip 
                            label="Supports: JPG, PNG, GIF (Max 10MB)" 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              background: 'rgba(46, 125, 50, 0.1)',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              fontWeight: 500,
                            }}
                          />
                </Box>
              )}
            </Box>

            {error && (
                      <Fade in timeout={300}>
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
                      </Fade>
            )}
                  </Stack>
          </Paper>
              </Slide>
            </Grid>

          {/* Results Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide in timeout={1200} direction="left">
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4,
                    minHeight: 500,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 50%, #2e7d32 100%)',
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: 'text.primary'
                    }}>
              Analysis Results
            </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-powered disease detection and recommendations
                    </Typography>
                  </Box>
            
            {isAnalyzing && (
                    <Fade in timeout={500}>
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                          <CircularProgress 
                            size={80} 
                            thickness={4}
                            sx={{ 
                              color: 'primary.main',
                              filter: 'drop-shadow(0px 4px 8px rgba(46, 125, 50, 0.3))',
                            }} 
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Science sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Analyzing your image...
                </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Our AI model is examining the cassava leaves for disease symptoms
                </Typography>
                        <LinearProgress 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            background: 'rgba(46, 125, 50, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)',
                              borderRadius: 3,
                            }
                          }} 
                        />
              </Box>
                    </Fade>
            )}

            {results && (
                    <Fade in timeout={800}>
              <Box>
                        <Card sx={{ 
                          mb: 3,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                          border: '1px solid rgba(46, 125, 50, 0.1)',
                          borderRadius: 3,
                          overflow: 'hidden',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: `linear-gradient(90deg, ${getConfidenceColor(results.confidence) === 'success' ? '#4caf50' : getConfidenceColor(results.confidence) === 'warning' ? '#ff9800' : '#f44336'} 0%, ${getConfidenceColor(results.confidence) === 'success' ? '#81c784' : getConfidenceColor(results.confidence) === 'warning' ? '#ffb74d' : '#e57373'} 100%)`,
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600,
                                  mb: 0.5,
                                  color: 'text.primary'
                                }}>
                                  {results.predicted_class || results.disease}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Disease Classification
                      </Typography>
                              </Box>
                      <Chip
                        label={`${(results.confidence * 100).toFixed(1)}% confidence`}
                        color={getConfidenceColor(results.confidence) as any}
                                variant="filled"
                                sx={{ 
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                  height: 32,
                                }}
                      />
                    </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {results.description}
                    </Typography>
                            
                            {/* Show API recommendation if available and different from fallback */}
                            {results.recommendation && (
                              <Alert 
                                severity={results.confidence < 0.7 ? "warning" : "info"} 
                                sx={{ 
                                  mt: 2,
                                  borderRadius: 2,
                                  border: 'none',
                                  background: results.confidence < 0.7 
                                    ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 183, 77, 0.1) 100%)'
                                    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(100, 181, 246, 0.1) 100%)',
                                }}
                                icon={results.confidence < 0.7 ? <Warning /> : <Info />}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {results.recommendation}
                                </Typography>
                              </Alert>
                            )}
                  </CardContent>
                </Card>

                        {/* Only show detailed symptoms and recommendations if confidence is high enough */}
                        {results.confidence >= 0.7 ? (
                          <Zoom in timeout={1000}>
                            <Box>
                              <Typography variant="h6" gutterBottom sx={{ 
                                mb: 3, 
                                fontWeight: 600,
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}>
                                <HealthAndSafety sx={{ color: 'warning.main' }} />
                                Common Symptoms
                </Typography>
                              <Box sx={{ mb: 4 }}>
                  {results.symptoms?.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                                    icon={<Warning sx={{ fontSize: 16 }} />}
                      variant="outlined"
                                    sx={{ 
                                      mr: 1, 
                                      mb: 1,
                                      background: 'rgba(255, 152, 0, 0.1)',
                                      borderColor: 'warning.main',
                                      color: 'warning.dark',
                                      fontWeight: 500,
                                      '&:hover': {
                                        background: 'rgba(255, 152, 0, 0.2)',
                                        transform: 'translateY(-1px)',
                                      },
                                      transition: 'all 0.2s ease-in-out',
                                    }}
                    />
                  ))}
                </Box>

                              <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />

                              <Typography variant="h6" gutterBottom sx={{ 
                                mb: 3, 
                                fontWeight: 600,
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}>
                                <CheckCircle sx={{ color: 'success.main' }} />
                                Recommendations
                </Typography>
                <Box>
                  {results.recommendations?.map((recommendation, index) => (
                                  <Fade in timeout={1200 + index * 200} key={index}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'flex-start', 
                                      mb: 2,
                                      p: 2,
                                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%)',
                                      borderRadius: 2,
                                      border: '1px solid rgba(76, 175, 80, 0.1)',
                                      transition: 'all 0.2s ease-in-out',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)',
                                        transform: 'translateX(4px)',
                                      }
                                    }}>
                                      <CheckCircle sx={{ 
                                        color: 'success.main', 
                                        mr: 2, 
                                        mt: 0.5, 
                                        fontSize: 20,
                                        flexShrink: 0,
                                      }} />
                                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {recommendation}
                      </Typography>
                    </Box>
                                  </Fade>
                  ))}
                </Box>
              </Box>
                          </Zoom>
                        ) : (
                          <Fade in timeout={800}>
                            <Alert 
                              severity="warning" 
                              sx={{ 
                                mt: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 183, 77, 0.1) 100%)',
                                border: '1px solid rgba(255, 152, 0, 0.2)',
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Low Confidence Classification
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                The classification confidence is below 70%. For more accurate results, please try:
                              </Typography>
                              <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                                <li><Typography variant="body2">Upload a clearer, higher resolution image</Typography></li>
                                <li><Typography variant="body2">Ensure good lighting and focus on the leaves</Typography></li>
                                <li><Typography variant="body2">Try capturing multiple angles of the affected area</Typography></li>
                                <li><Typography variant="body2">Consult with a local agricultural expert for confirmation</Typography></li>
                              </Box>
                            </Alert>
                          </Fade>
                        )}
                      </Box>
                    </Fade>
            )}

            {!isAnalyzing && !results && (
                    <Fade in timeout={600}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 8, 
                        color: 'text.secondary',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                        borderRadius: 3,
                        border: '2px dashed rgba(0,0,0,0.1)',
                      }}>
                        <Box sx={{ 
                          position: 'relative',
                          display: 'inline-block',
                          mb: 3,
                        }}>
                          <Info sx={{ 
                            fontSize: 80, 
                            opacity: 0.6,
                            filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))',
                          }} />
                          <Box sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'bounce 2s infinite',
                            '@keyframes bounce': {
                              '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                              '40%': { transform: 'translateY(-10px)' },
                              '60%': { transform: 'translateY(-5px)' },
                            }
                          }}>
                            <AutoAwesome sx={{ fontSize: 16, color: 'white' }} />
                          </Box>
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Ready for Analysis
                </Typography>
                        <Typography variant="body2" sx={{ maxWidth: 300, mx: 'auto', lineHeight: 1.6 }}>
                          Upload a clear image of your cassava leaves and click "Analyze Image" to get started with AI-powered disease detection
                </Typography>
              </Box>
                    </Fade>
            )}
          </Paper>
              </Slide>
            </Grid>
          </Grid>

      {/* Tips Section */}
          <Fade in timeout={1400}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                mt: 6,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 25%, #ff9800 50%, #ffb74d 75%, #2196f3 100%)',
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
          Tips for Best Results
        </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Follow these guidelines to get the most accurate disease classification results
            </Typography>
          </Box>
              
              <Grid container spacing={4}>
                {[
                  {
                    icon: <CameraAlt sx={{ fontSize: 48 }} />,
                    title: 'Clear Photos',
                    description: 'Take photos in good lighting with clear focus on the leaves',
                    color: 'primary.main',
                    delay: 0,
                  },
                  {
                    icon: <Info sx={{ fontSize: 48 }} />,
                    title: 'Multiple Angles',
                    description: 'Capture both sides of leaves and any visible symptoms',
                    color: 'info.main',
                    delay: 200,
                  },
                  {
                    icon: <Warning sx={{ fontSize: 48 }} />,
                    title: 'Early Detection',
                    description: 'Monitor plants regularly and test at first sign of issues',
                    color: 'warning.main',
                    delay: 400,
                  },
                  {
                    icon: <CheckCircle sx={{ fontSize: 48 }} />,
                    title: 'Follow Advice',
                    description: 'Implement recommendations promptly for best results',
                    color: 'success.main',
                    delay: 600,
                  },
                ].map((tip, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Fade in timeout={1600 + tip.delay}>
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0px 12px 40px rgba(0,0,0,0.15)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                        }
                      }}>
                        <Box sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${tip.color}20 0%, ${tip.color}10 100%)`,
                          mb: 3,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${tip.color} 0%, ${tip.color}80 100%)`,
                            opacity: 0.1,
                            transition: 'opacity 0.3s ease',
                          },
                          '&:hover::before': {
                            opacity: 0.2,
                          }
                        }}>
                          <Box sx={{ color: tip.color, position: 'relative', zIndex: 1 }}>
                            {tip.icon}
                          </Box>
          </Box>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 2,
                        }}>
                          {tip.title}
            </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          lineHeight: 1.6,
                          maxWidth: 200,
                          mx: 'auto',
                        }}>
                          {tip.description}
            </Typography>
          </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
      </Paper>
          </Fade>

    </Box>
      </Fade>
    </Container>
  );
};

export default DiseaseClassifier;
