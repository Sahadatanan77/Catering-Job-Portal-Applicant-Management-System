import api from './api';

export const authService = {
  // Register applicant
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login (Applicant or Hirer)
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current logged-in user and applicant profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Forgot password request
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Create new hirer account (Hirer only)
  createHirer: async (hirerData) => {
    const response = await api.post('/auth/create-hirer', hirerData);
    return response.data;
  },
};

export default authService;
