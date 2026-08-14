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
    // Mock login to bypass backend requirement
    const tokens = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
    apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    // Store email temporarily to use in getMe mock if needed
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_mock_email', data.email);
    }
    return tokens;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Mock registration to bypass backend requirement
    const tokens = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
    apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_mock_email', data.email);
      localStorage.setItem('sb_mock_role', data.role);
      localStorage.setItem('sb_mock_fname', data.firstName);
      localStorage.setItem('sb_mock_lname', data.lastName);
    }
    return tokens;
  },

  async logout(): Promise<void> {
    // Mock logout
    apiClient.clearTokens();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_mock_email');
      localStorage.removeItem('sb_mock_role');
      localStorage.removeItem('sb_mock_fname');
      localStorage.removeItem('sb_mock_lname');
    }
  },
};
