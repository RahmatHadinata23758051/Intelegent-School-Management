import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log aborted requests
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    // Log all other errors for debugging
    console.error('[API] Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
    });

    // Handle 401 - Unauthorized (but not for login endpoint)
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      console.warn('[API] Unauthorized (401) - clearing auth');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Don't redirect here, let the app handle it
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Forbidden (403):', error.response.data);
    }

    // Handle 500 - Server Error
    if (error.response?.status >= 500) {
      console.error('[API] Server error (5xx):', error.response.data);
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
