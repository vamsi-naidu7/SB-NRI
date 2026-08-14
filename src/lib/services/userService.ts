import { apiClient } from '../api';

export const userService = {
  async getMe() {
    return apiClient.get('/api/v1/users/me');
  },

  async getAll() {
    return apiClient.get('/api/v1/users');
  },
};
