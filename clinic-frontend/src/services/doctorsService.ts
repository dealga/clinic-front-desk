import api from './api';
  import { Doctor } from '../types';
  
  export const doctorsService = {
    async getAll(params?: { search?: string; specialization?: string; location?: string }) {
      const response = await api.get('/doctors', { params });
      return response.data;
    },
  
    async getById(id: number) {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    },
  
    async create(data: Partial<Doctor>) {
      const response = await api.post('/doctors', data);
      return response.data;
    },
  
    async update(id: number, data: Partial<Doctor>) {
      const response = await api.patch(`/doctors/${id}`, data);
      return response.data;
    },
  
    async delete(id: number) {
      await api.delete(`/doctors/${id}`);
    },
  
    async getSpecializations() {
      const response = await api.get('/doctors/specializations');
      return response.data;
    },
  
    async getLocations() {
      const response = await api.get('/doctors/locations');
      return response.data;
    }
  };
  
