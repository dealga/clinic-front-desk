 import api from './api';
  import { Appointment } from '../types';
  
  export const appointmentsService = {
    async getAll(params?: { 
      doctorId?: number; 
      patientId?: number; 
      date?: string; 
      status?: string; 
    }) {
      const response = await api.get('/appointments', { params });
      return response.data;
    },
  
    async getById(id: number) {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    },
  
    async create(data: Partial<Appointment>) {
      const response = await api.post('/appointments', data);
      return response.data;
    },
  
    async update(id: number, data: Partial<Appointment>) {
      const response = await api.patch(`/appointments/${id}`, data);
      return response.data;
    },
  
    async cancel(id: number) {
      const response = await api.patch(`/appointments/${id}/cancel`);
      return response.data;
    },
  
    async reschedule(id: number, date: string, time: string) {
      const response = await api.patch(`/appointments/${id}/reschedule`, { date, time });
      return response.data;
    },
  
    async delete(id: number) {
      await api.delete(`/appointments/${id}`);
    },
  
    async getAvailableSlots(doctorId: number, date: string) {
      const response = await api.get(`/appointments/available-slots/${doctorId}/${date}`);
      return response.data;
    }
  };