import { apiClient } from '../api';

export const userService = {
  async getMe() {
    // Return mock user
    let email = 'demo@example.com';
    let role = 'NRI';
    let firstName = 'Demo';
    let lastName = 'User';
    
    if (typeof window !== 'undefined') {
      email = localStorage.getItem('sb_mock_email') || email;
      role = localStorage.getItem('sb_mock_role') || role;
      firstName = localStorage.getItem('sb_mock_fname') || firstName;
      lastName = localStorage.getItem('sb_mock_lname') || lastName;
    }

    return {
      id: 'mock-user-1',
      email,
      firstName,
      lastName,
      roles: [{ role: { name: role } }]
    };
  },

  async getAll() {
    // Mock get all
    return [];
  },
};
