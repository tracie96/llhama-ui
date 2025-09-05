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
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  CloudUpload,
  CameraAlt,
  CheckCircle,
  Warning,
  Info,
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Cassava Disease Classifier
      </Typography>
      
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}>
        Upload a clear image of your cassava leaves to detect diseases and receive personalized recommendations 
        for treatment and management.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Image Upload Section */}
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Upload Cassava Leaf Image
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
            
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              <input {...getInputProps()} />
              {selectedImage ? (
                <Box>
                  <img
                    src={selectedImage}
                    alt="Selected cassava leaf"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAnalysis();
                    }}
                    sx={{ mr: 2 }}
                  >
                    Remove Image
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeImage();
                    }}
                    disabled={isAnalyzing}
                    startIcon={isAnalyzing ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click to select a file
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports: JPG, PNG, GIF (Max 10MB)
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {/* Results Section */}
          <Paper elevation={3} sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Analysis Results
            </Typography>
            
            {isAnalyzing && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Analyzing your image...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI model is examining the cassava leaves for disease symptoms
                </Typography>
              </Box>
            )}

            {results && (
              <Box>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {results.predicted_class || results.disease}
                      </Typography>
                      <Chip
                        label={`${(results.confidence * 100).toFixed(1)}% confidence`}
                        color={getConfidenceColor(results.confidence) as any}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {results.description}
                    </Typography>
                    
                    {/* Show API recommendation if available and different from fallback */}
                    {results.recommendation && (
                      <Alert 
                        severity={results.confidence < 0.7 ? "warning" : "info"} 
                        sx={{ mt: 2 }}
                        icon={results.confidence < 0.7 ? <Warning /> : <Info />}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {results.recommendation}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Only show detailed symptoms and recommendations if confidence is high enough */}
                {results.confidence >= 0.7 ? (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Common Symptoms:
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {results.symptoms?.map((symptom, index) => (
                        <Chip
                          key={index}
                          label={symptom}
                          icon={<Warning />}
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Recommendations:
                    </Typography>
                    <Box>
                      {results.recommendations?.map((recommendation, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <CheckCircle sx={{ color: 'success.main', mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="body2">
                            {recommendation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                      Low Confidence Classification
                    </Typography>
                    <Typography variant="body2">
                      The classification confidence is below 70%. For more accurate results, please try:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                      <li><Typography variant="body2">Upload a clearer, higher resolution image</Typography></li>
                      <li><Typography variant="body2">Ensure good lighting and focus on the leaves</Typography></li>
                      <li><Typography variant="body2">Try capturing multiple angles of the affected area</Typography></li>
                      <li><Typography variant="body2">Consult with a local agricultural expert for confirmation</Typography></li>
                    </Box>
                  </Alert>
                )}
              </Box>
            )}

            {!isAnalyzing && !results && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Info sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No Analysis Yet
                </Typography>
                <Typography variant="body2">
                  Upload an image and click "Analyze Image" to get started
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

      {/* Tips Section */}
      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Tips for Best Results
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CameraAlt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Clear Photos</Typography>
            <Typography variant="body2" color="text.secondary">
              Take photos in good lighting with clear focus on the leaves
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Info sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Multiple Angles</Typography>
            <Typography variant="body2" color="text.secondary">
              Capture both sides of leaves and any visible symptoms
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Warning sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Early Detection</Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor plants regularly and test at first sign of issues
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Follow Advice</Typography>
            <Typography variant="body2" color="text.secondary">
              Implement recommendations promptly for best results
            </Typography>
          </Box>
        </Box>
      </Paper>

    </Box>

  );
};

export default DiseaseClassifier;
