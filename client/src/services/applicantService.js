import api from './api';

export const applicantService = {
  // Get applicant's own profile
  getOwnProfile: async () => {
    const response = await api.get('/applicants/profile');
    return response.data;
  },

  // Create or update profile
  saveProfile: async (profileData) => {
    const response = await api.post('/applicants/profile', profileData);
    return response.data;
  },

  // Upload CV, profile picture, and event pictures
  uploadFiles: async (formData) => {
    const response = await api.post('/applicants/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete an event/additional picture
  deletePhoto: async (photoId) => {
    const response = await api.delete(`/applicants/photos/${photoId}`);
    return response.data;
  },

  // Get all applicants (Hirer)
  getAllApplicants: async (params = {}) => {
    const response = await api.get('/applicants', { params });
    return response.data;
  },

  // Get applicant details by ID (Hirer)
  getApplicantById: async (id) => {
    const response = await api.get(`/applicants/${id}`);
    return response.data;
  },

  // Direct download link for applicant CV (with token query parameter for browser links)
  getDownloadCvUrl: (id, download = false) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token') || '';
    return `${baseUrl}/applicants/${id}/cv/download?token=${encodeURIComponent(token)}${download ? '&download=true' : ''}`;
  },
};

export default applicantService;
