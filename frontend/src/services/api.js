import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Resume API functions
export const resumeAPI = {
  // Get all resumes
  getResumes: () => api.get('/resume'),
  
  // Get single resume
  getResume: (id) => api.get(`/resume/${id}`),
  
  // Create resume
  createResume: (data) => api.post('/resume', data),
  
  // Update resume
  updateResume: (id, data) => api.put(`/resume/${id}`, data),
  
  // Delete resume
  deleteResume: (id) => api.delete(`/resume/${id}`),
  
  // Set default resume
  setDefaultResume: (id) => api.put(`/resume/${id}/set-default`),
  
  // Duplicate resume
  duplicateResume: (id) => api.post(`/resume/${id}/duplicate`),
  
  // Toggle public visibility
  togglePublicResume: (id) => api.put(`/resume/${id}/toggle-public`),
  
  // Get public resume
  getPublicResume: (slug) => api.get(`/public/resume/${slug}`),
};

// Auth API functions
export const authAPI = {
  // Login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Signup
  signup: (firstName, lastName, email, password) => 
    api.post('/auth/signup', { firstName, lastName, email, password }),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;
