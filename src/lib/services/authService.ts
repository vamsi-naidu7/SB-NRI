import { apiClient } from '../api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const tokens = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const tokens = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
    apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (e) {
      console.warn('Logout API failed, clearing tokens locally anyway', e);
    } finally {
      apiClient.clearTokens();
    }
  },
};
