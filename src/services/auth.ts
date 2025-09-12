// Authentication Service for Casava API
const AUTH_API_BASE_URL = 'https://casava-api.dataverseafrica.org/api/auth';
const API_BASE_URL = 'https://casava-api.dataverseafrica.org';

// TypeScript interfaces for authentication
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  data: {
    username: string;
    email: string;
  };
  code: number;
  token: null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
    };
    expires_in: number;
    token_type: string;
  };
  code: number;
  token: string;
}

export interface LogoutResponse {
  status: string;
  message: string;
  data: null;
  code: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  last_login?: string;
  is_active?: boolean;
}

export interface UsersListResponse {
  status: string;
  message: string;
  data: {
    users: User[];
    total_count: number;
  };
  code: number;
}

export interface ApiError {
  status?: string;
  message?: string;
  error?: string;
  code?: number;
}

class AuthService {
  private baseURL: string;

  constructor(baseURL: string = AUTH_API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
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
      console.error('Auth API request failed:', error);
      throw error;
    }
  }

  // Sign up a new user
  async signup(userData: SignupRequest): Promise<SignupResponse> {
    return this.request<SignupResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Logout user
  async logout(token: string): Promise<LogoutResponse> {
    return this.request<LogoutResponse>('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: '',
    });
  }

  // Get list of users (admin route)
  async getUsers(token: string): Promise<UsersListResponse> {
    const url = `${API_BASE_URL}/api/admin/users`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Activate user (admin route)
  async activateUser(token: string, userId: number): Promise<{ status: string; message: string }> {
    const url = `${API_BASE_URL}/api/admin/users/${userId}/activate`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Deactivate user (admin route)
  async deactivateUser(token: string, userId: number): Promise<{ status: string; message: string }> {
    const url = `${API_BASE_URL}/api/admin/users/${userId}/deactivate`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get user info from token (basic JWT decode)
  getUserFromToken(): { id: number; username: string; email: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export the class for testing or custom instances
export default AuthService;
