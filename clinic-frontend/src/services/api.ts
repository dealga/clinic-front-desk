  // src/services/api.ts
  import axios from 'axios';
  import { AuthResponse, LoginCredentials } from '../types';
  
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
  
  const api = axios.create({
    baseURL: API_BASE_URL,
  });
  
  // Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // Handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export default api;
  
  // Auth service
  export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
  
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  
    getToken() {
      return localStorage.getItem('token');
    },
  
    getUser() {

      if (typeof window === 'undefined') {
        return null; // Running on server, no localStorage
      }
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
  
    isAuthenticated() {
      return !!this.getToken();
    }
  };
  
