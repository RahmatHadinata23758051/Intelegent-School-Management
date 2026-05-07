/**
 * Frontend Route Constants
 * Centralized route paths untuk menghindari hardcoding di banyak file
 */

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Students
  STUDENTS: '/students',
  STUDENT_DETAIL: '/students/:id',
  
  // Classes
  CLASSES: '/classes',
  CLASS_DETAIL: '/classes/:id',
  
  // Academic
  ACADEMIC_YEARS: '/academic-years',
  SEMESTERS: '/semesters',
};

/**
 * Helper function untuk generate dynamic routes
 */
export const getStudentDetailRoute = (id) => `/students/${id}`;
export const getClassDetailRoute = (id) => `/classes/${id}`;
