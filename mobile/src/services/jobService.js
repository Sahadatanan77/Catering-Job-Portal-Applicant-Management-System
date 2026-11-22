import api from './api';

export const jobService = {
  // Public or Applicant: Fetch active catering shifts
  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  // Get single job details
  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  // Applicant: 1-Click Apply
  applyForJob: async (jobId, coverNote = '') => {
    const res = await api.post(`/jobs/${jobId}/apply`, { coverNote });
    return res.data;
  },

  // Applicant: Get my submitted applications
  getMyApplications: async () => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  // Hirer: Get recruitment metrics
  getDashboardStats: async () => {
    const res = await api.get('/applications/stats/dashboard');
    return res.data;
  },

  // Hirer: Update application status (shortlisted, hired, rejected)
  updateStatus: async (applicationId, status, notes = '') => {
    const res = await api.put(`/applications/${applicationId}/status`, {
      status,
      notes,
    });
    return res.data;
  },
};
