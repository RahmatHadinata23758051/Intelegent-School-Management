import axiosInstance from './api'

export const authService = {
  register: (data) => axiosInstance.post('/register', data),
  login: (data) => axiosInstance.post('/login', data),
  logout: () => axiosInstance.post('/logout'),
  getMe: () => axiosInstance.get('/me'),
}

export const studentService = {
  getAll: () => axiosInstance.get('/students'),
  getById: (id) => axiosInstance.get(`/students/${id}`),
  create: (data) => axiosInstance.post('/students', data),
  update: (id, data) => axiosInstance.put(`/students/${id}`, data),
  delete: (id) => axiosInstance.delete(`/students/${id}`),
  getByRiskLevel: (level, limit = 20) =>
    axiosInstance.get('/students/risk-level', {
      params: { level, limit },
    }),
}

export const classService = {
  getAll: () => axiosInstance.get('/classes'),
  getById: (id) => axiosInstance.get(`/classes/${id}`),
  create: (data) => axiosInstance.post('/classes', data),
  update: (id, data) => axiosInstance.put(`/classes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/classes/${id}`),
}

export const gradeService = {
  getByStudent: (studentId) =>
    axiosInstance.get(`/students/${studentId}/grades`),
  create: (studentId, data) =>
    axiosInstance.post(`/students/${studentId}/grades`, data),
  update: (studentId, gradeId, data) =>
    axiosInstance.put(`/students/${studentId}/grades/${gradeId}`, data),
  delete: (studentId, gradeId) =>
    axiosInstance.delete(`/students/${studentId}/grades/${gradeId}`),
}

export const violationService = {
  getByStudent: (studentId) =>
    axiosInstance.get(`/students/${studentId}/violations`),
  create: (studentId, data) =>
    axiosInstance.post(`/students/${studentId}/violations`, data),
  update: (studentId, violationId, data) =>
    axiosInstance.put(`/students/${studentId}/violations/${violationId}`, data),
  delete: (studentId, violationId) =>
    axiosInstance.delete(`/students/${studentId}/violations/${violationId}`),
}
