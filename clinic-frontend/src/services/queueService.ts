  
  // src/services/queueService.ts
  import api from './api';
  import { QueueEntry } from '../types';
  
  export const queueService = {
    async getAll(params?: { status?: string; priority?: string }) {
      const response = await api.get('/queue', { params });
      return response.data;
    },
  
    async getById(id: number) {
      const response = await api.get(`/queue/${id}`);
      return response.data;
    },
  
    async create(data: Partial<QueueEntry>) {
      const response = await api.post('/queue', data);
      return response.data;
    },
  
    async update(id: number, data: Partial<QueueEntry>) {
      const response = await api.patch(`/queue/${id}`, data);
      return response.data;
    },
  
    async delete(id: number) {
      await api.delete(`/queue/${id}`);
    },
  
    async getStats() {
      const response = await api.get('/queue/stats');
      return response.data;
    }
  };
  
