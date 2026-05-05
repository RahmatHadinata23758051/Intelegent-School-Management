import axios from 'axios'
import { errorHandler } from '../utils/errors'

const API_URL = '/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = errorHandler.handle(error)

    if (normalizedError.statusCode === 401) {
      localStorage.removeItem('auth_token')

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'))
      }
    }

    return Promise.reject(normalizedError)
  }
)

export default axiosInstance
