import { apiClient } from '../api';

export const maintenanceService = {
  async getAll() {
    return apiClient.get('/api/v1/maintenance');
  },

  async getById(id: string) {
    return apiClient.get(`/api/v1/maintenance/${id}`);
  },

  async create(data: { propertyId: string; description: string; priority?: string; images?: string; videos?: string }) {
    return apiClient.post('/api/v1/maintenance', data);
  },

  async updateStatus(id: string, status: string) {
    return apiClient.patch(`/api/v1/maintenance/${id}/status`, { status });
  },
};
