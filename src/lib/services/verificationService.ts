import { apiClient } from '../api';

export const verificationService = {
  async getAll() {
    return apiClient.get('/api/v1/verification');
  },

  async getByProperty(propertyId: string) {
    return apiClient.get(`/api/v1/verification/property/${propertyId}`);
  },

  async requestVerification(propertyId: string) {
    return apiClient.post('/api/v1/verification/request', { propertyId });
  },

  async finalizeItem(itemId: string, data: any) {
    return apiClient.patch(`/api/v1/verification/item/${itemId}`, data);
  },
};
