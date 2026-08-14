import { apiClient } from '../api';

export const leaseService = {
  async getAll() {
    return apiClient.get('/api/v1/leases');
  },

  async getById(id: string) {
    return apiClient.get(`/api/v1/leases/${id}`);
  },

  async create(data: { propertyId: string; expectedRent: number; specialConditions?: string }) {
    return apiClient.post('/api/v1/leases', data);
  },

  async recordPayment(id: string, amount: number) {
    return apiClient.post(`/api/v1/leases/${id}/payment`, { amount });
  },

  async updateStatus(id: string, status: string) {
    return apiClient.patch(`/api/v1/leases/${id}/status`, { status });
  },
};
