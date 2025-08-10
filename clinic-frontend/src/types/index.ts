// src/types/index.ts
export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    gender: string;
    location: string;
    phone?: string;
    email?: string;
    availability?: string;
    is_active: boolean;
  }
  
  export interface Patient {
    id: number;
    name: string;
    phone: string;
    email?: string;
    age?: number;
    gender?: string;
    address?: string;
  }
  
  export interface QueueEntry {
    id: number;
    patient_id: number;
    doctor_id?: number;
    queue_number: number;
    priority: 'normal' | 'urgent' | 'emergency';
    status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    patient: Patient;
    doctor?: Doctor;
  }
  
  export interface Appointment {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    duration_minutes: number;
    status: 'booked' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
    patient: Patient;
    doctor: Doctor;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    user: User;
  }
  
