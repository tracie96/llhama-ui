import { getApiConfig } from '../config/api';

// API Configuration
const config = getApiConfig();
export const API_BASE_URL = config.BASE_URL;

// TypeScript interfaces based on the OpenAPI schema
export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  message: string;
  language?: string;
  conversation_history?: ChatMessage[];
  disease_context?: any;
}

export interface ChatResponse {
  response: string;
  language?: string;
  timestamp?: string;
}

export interface DiseaseClassificationResponse {
  success: boolean;
  predicted_class: string;
  confidence: number;
  recommendation: string;
  initial_message?: string;
  language?: string;
  message?: string;
  // Legacy fields for backward compatibility
  disease?: string;
  description?: string;
  symptoms?: string[];
  recommendations?: string[];
  timestamp?: string;
}

export interface VoiceProcessResponse {
  success: boolean;
  user_text: string;
  english_text: string;
  ai_response: string;
  english_response: string;
  audio_available: boolean;
  voice_used: string;
  user_language: string;
  message: string;
  audio_data: string; // Base64 encoded audio response
  transcription?: string; // For backward compatibility
  response?: string; // For backward compatibility
  language?: string;
  timestamp?: string;
}

export interface TranscriptionResponse {
  transcription: string;
  language?: string;
  timestamp?: string;
}

export interface TTSResponse {
  audio_data: string; // Base64 encoded audio
  language?: string;
  timestamp?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
  services: Record<string, boolean>;
}

export interface SupportedLanguagesResponse {
  success: boolean;
  message?: string;
  error?: string;
  text_languages: string[];
  voice_languages: string[];
  voice_mapping: Record<string, string>;
}

export interface ApiError {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
  message?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async requestWithFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Image Classification
  async classifyImage(
    imageFile: File,
    language: string = 'English'
  ): Promise<DiseaseClassificationResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('language', language);

    return this.requestWithFormData<DiseaseClassificationResponse>(
      '/api/classify/image',
      formData
    );
  }

  // Chat endpoints
  async sendTextMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat/text', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getResponseWithContext(
    message: string,
    language: string = 'English',
    diseaseDetected?: string,
    confidence?: number
  ): Promise<ChatResponse> {
    const params = new URLSearchParams({
      message,
      language,
    });

    if (diseaseDetected) {
      params.append('disease_detected', diseaseDetected);
    }
    if (confidence !== undefined) {
      params.append('confidence', confidence.toString());
    }

    return this.request<ChatResponse>(`/api/chat/context?${params}`, {
      method: 'POST',
    });
  }

  // Voice endpoints
  async processVoiceMessage(
    audioFile: File,
    language: string = 'English',
    diseaseContext?: string
  ): Promise<VoiceProcessResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);
    if (diseaseContext) {
      formData.append('disease_context', diseaseContext);
    }

    return this.requestWithFormData<VoiceProcessResponse>(
      '/api/voice/process',
      formData
    );
  }

  async transcribeAudio(
    audioFile: File,
    language: string = 'English'
  ): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    return this.requestWithFormData<TranscriptionResponse>(
      '/api/voice/transcribe',
      formData
    );
  }

  async textToSpeech(
    text: string,
    language: string = 'English'
  ): Promise<TTSResponse> {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', language);

    return this.requestWithFormData<TTSResponse>(
      '/api/voice/synthesize',
      formData
    );
  }

  // System endpoints
  async getHealthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/api/system/health');
  }

  async getSupportedLanguages(): Promise<SupportedLanguagesResponse> {
    return this.request<SupportedLanguagesResponse>('/api/system/languages');
  }

  async getClassificationHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/classify/health');
  }

  async getRootHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
