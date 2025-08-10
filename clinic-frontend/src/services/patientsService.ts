import api from './api';
  import { Patient } from '../types';
  
  export const patientsService = {
    async getAll(search?: string) {
      const response = await api.get('/patients', { params: { search } });
      return response.data;
    },
  
    async getById(id: number) {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    },
  
    async getByPhone(phone: string) {
      const response = await api.get(`/patients/phone/${phone}`);
      return response.data;
    },
  
    async create(data: Partial<Patient>) {
      const response = await api.post('/patients', data);
      return response.data;
    },
  
    async update(id: number, data: Partial<Patient>) {
      const response = await api.patch(`/patients/${id}`, data);
      return response.data;
    },
  
    async delete(id: number) {
      await api.delete(`/patients/${id}`);
    }
  };
