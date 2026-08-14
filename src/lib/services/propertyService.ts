import { apiClient } from '../api';

export const propertyService = {
  async getAll(filters?: { type?: string }) {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    const query = params.toString();
    return apiClient.get(`/api/v1/properties${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiClient.get(`/api/v1/properties/${id}`);
  },

  async create(data: any) {
    return apiClient.post('/api/v1/properties', data);
  },
};
