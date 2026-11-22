import api from './api';

export const jobService = {
  // Get all catering jobs (filtered or public active)
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get job details by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create catering job (Hirer)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update catering job (Hirer)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete catering job (Hirer)
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Apply for a job (Applicant)
  applyForJob: async (jobId, coverNote = '') => {
    const response = await api.post('/applications', { jobId, coverNote });
    return response.data;
  },

  // Get applicant's own applications
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  // Get all applications (Hirer)
  getAllApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  // Update application status (Hirer: pending, reviewed, shortlisted, rejected, hired)
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status, notes });
    return response.data;
  },

  // Get Hirer dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/applications/stats/dashboard');
    return response.data;
  },
};

export default jobService;
