// API Configuration
export const API_CONFIG = {
  // Base URL for the API - can be overridden by environment variables
  BASE_URL: process.env.REACT_APP_API_URL || 'http://ec2-34-199-70-74.compute-1.amazonaws.com:8000',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  SUPPORTED_AUDIO_TYPES: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'],
  
  // Default language
  DEFAULT_LANGUAGE: 'English',
  
  // Supported languages (can be fetched from API)
  SUPPORTED_LANGUAGES: [
    'English',
    'Spanish',
    'French',
    'Portuguese',
    'Swahili',
    'Yoruba',
    'Igbo',
    'Hausa',
  ],
} as const;

// Environment-specific configurations
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    ...API_CONFIG,
    // Override base URL for production if needed
    BASE_URL: isProduction 
      ? (process.env.REACT_APP_API_URL || 'http://34.199.70.74:8000')
      : API_CONFIG.BASE_URL,
    
    // Enable debug logging in development
    DEBUG: isDevelopment,
  };
};

export default API_CONFIG;
