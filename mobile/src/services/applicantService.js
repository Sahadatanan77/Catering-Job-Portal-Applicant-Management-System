import api from './api';

export const applicantService = {
  // Applicant: Get personal profile
  getMyProfile: async () => {
    const res = await api.get('/applicants/me');
    return res.data;
  },

  // Applicant: Update profile details
  updateProfile: async (data) => {
    const res = await api.put('/applicants/me', data);
    return res.data;
  },

  // Hirer: Get all candidates in pool
  getAllApplicants: async (params = {}) => {
    const res = await api.get('/applicants', { params });
    return res.data;
  },

  // Hirer: Get candidate profile by ID
  getApplicantById: async (id) => {
    const res = await api.get(`/applicants/${id}`);
    return res.data;
  },
};
