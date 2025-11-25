import api from './api';

export const complaintService = {
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  addResponse: async (id, message) => {
    const response = await api.post(`/complaints/${id}/responses`, { message });
    return response.data;
  }
};