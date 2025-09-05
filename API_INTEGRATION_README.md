# Cassava Disease Detection API Integration

This document describes the integration of the Cassava Disease Detection API into the React application.

## API Endpoints Integrated

### 1. Image Classification
- **Endpoint**: `/api/classify/image`
- **Method**: POST
- **Purpose**: Classify cassava leaf images for disease detection
- **Features**: 
  - File upload with validation
  - Language selection
  - Confidence scoring
  - Disease recommendations

### 2. Chat System
- **Endpoints**: 
  - `/api/chat/text` - Send text messages
  - `/api/chat/context` - Get responses with disease context
- **Features**:
  - Conversation history
  - Language support
  - Disease context integration

### 3. Voice Processing
- **Endpoints**:
  - `/api/voice/process` - Process voice messages
  - `/api/voice/transcribe` - Transcribe audio only
  - `/api/voice/synthesize` - Text-to-speech
- **Features**:
  - Audio recording
  - File upload
  - Voice synthesis
  - Multilingual support

### 4. System Health
- **Endpoints**:
  - `/api/system/health` - Overall system health
  - `/api/system/languages` - Supported languages
  - `/api/classify/health` - Classification service health
- **Features**:
  - Real-time monitoring
  - Service status
  - Language support info

## Configuration

### Environment Variables
Create a `.env` file in the project root with:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Development settings
REACT_APP_DEBUG=true
REACT_APP_ENVIRONMENT=development
```

### API Configuration
The API configuration is managed in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  SUPPORTED_AUDIO_TYPES: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'],
  DEFAULT_LANGUAGE: 'English',
  SUPPORTED_LANGUAGES: [
    'English', 'Spanish', 'French', 'Portuguese', 
    'Swahili', 'Yoruba', 'Igbo', 'Hausa'
  ],
};
```

## Components Added

### 1. API Service (`src/services/api.ts`)
- Centralized API communication
- TypeScript interfaces for all endpoints
- Error handling and retry logic
- File upload support

### 2. Voice Processor (`src/components/VoiceProcessor.tsx`)
- Audio recording functionality
- File upload for audio
- Voice synthesis
- Language selection

### 3. System Health (`src/components/SystemHealth.tsx`)
- Real-time system monitoring
- Service status display
- Language support information
- Auto-refresh functionality

## Pages Updated

### 1. Disease Classifier (`src/pages/DiseaseClassifier.tsx`)
- Integrated real API calls
- Language selection
- Enhanced error handling
- Fallback data for offline mode

### 2. Advisory System (`src/pages/AdvisorySystem.tsx`)
- Real chat API integration
- Conversation history
- Language support
- Offline fallback

### 3. New Pages Added
- **Voice Assistant** (`src/pages/VoiceAssistant.tsx`)
- **System Status** (`src/pages/SystemStatus.tsx`)

## Features Implemented

### ✅ Completed
1. **API Service Layer** - Complete TypeScript API service
2. **Disease Classification** - Real API integration with fallbacks
3. **Chat System** - Real-time chat with context support
4. **Voice Processing** - Audio recording, transcription, and TTS
5. **Language Support** - Multilingual interface throughout
6. **System Health** - Real-time monitoring and status
7. **Error Handling** - Comprehensive error handling with fallbacks
8. **Configuration** - Environment-based configuration

### 🔄 Features
- **Offline Mode**: Fallback responses when API is unavailable
- **File Validation**: Size and type validation for uploads
- **Real-time Updates**: Auto-refresh for system health
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: Screen reader support and keyboard navigation

## Usage

### Starting the Application
1. Install dependencies: `npm install`
2. Set up environment variables (create `.env` file)
3. Start the development server: `npm start`
4. Ensure the API server is running on the configured URL

### API Integration
The application will automatically:
- Connect to the configured API endpoint
- Fall back to offline mode if API is unavailable
- Display appropriate error messages
- Provide real-time system health monitoring

### Language Support
Users can select their preferred language for:
- Disease classification results
- Chat responses
- Voice processing
- System interface

## Error Handling

The application includes comprehensive error handling:
- Network connectivity issues
- API service unavailability
- File upload errors
- Invalid responses
- Timeout handling

All errors are displayed to users with helpful messages and fallback options.

## Development Notes

- All API calls include proper TypeScript typing
- Error boundaries prevent application crashes
- Loading states provide user feedback
- Offline mode ensures functionality even without API
- Configuration is environment-based for easy deployment
