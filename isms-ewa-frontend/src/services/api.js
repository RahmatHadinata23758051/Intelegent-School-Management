import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

console.log('[api] API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    console.log('[api] Request interceptor - token:', token ? 'present' : 'missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[api] Added Authorization header');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    console.log('[api] Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[api] Response error:', error.response?.status, error.response?.data);
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.log('[api] 401 Unauthorized - clearing auth');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/auth/me'),

  refresh: () =>
    api.post('/auth/refresh'),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStatistics: () =>
    api.get('/dashboard/statistics'),

  getRiskMonitoring: () =>
    api.get('/dashboard/risk-monitoring'),
};

// Students endpoints
export const studentsAPI = {
  getAll: (params = {}) =>
    api.get('/students', { params }),

  getById: (id) =>
    api.get(`/students/${id}`),

  create: (data) =>
    api.post('/students', data),

  update: (id, data) =>
    api.put(`/students/${id}`, data),

  delete: (id) =>
    api.delete(`/students/${id}`),
};

// Classes endpoints
export const classesAPI = {
  getAll: (params = {}) =>
    api.get('/school-classes', { params }),

  getById: (id) =>
    api.get(`/school-classes/${id}`),

  create: (data) =>
    api.post('/school-classes', data),

  update: (id, data) =>
    api.put(`/school-classes/${id}`, data),

  delete: (id) =>
    api.delete(`/school-classes/${id}`),
};

// Grades endpoints
export const gradesAPI = {
  getAll: (params = {}) =>
    api.get('/grades', { params }),

  getById: (id) =>
    api.get(`/grades/${id}`),

  create: (data) =>
    api.post('/grades', data),

  update: (id, data) =>
    api.put(`/grades/${id}`, data),

  delete: (id) =>
    api.delete(`/grades/${id}`),
};

// Violations endpoints
export const violationsAPI = {
  getAll: (params = {}) =>
    api.get('/violations', { params }),

  getById: (id) =>
    api.get(`/violations/${id}`),

  create: (data) =>
    api.post('/violations', data),

  update: (id, data) =>
    api.put(`/violations/${id}`, data),

  delete: (id) =>
    api.delete(`/violations/${id}`),
};

// Risk scores endpoints
export const riskScoresAPI = {
  getAll: (params = {}) =>
    api.get('/risk-scores', { params }),

  getById: (id) =>
    api.get(`/risk-scores/${id}`),
};

export default api;
