// src/components/AppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
// import { appointmentsService, patientsService, doctorsService } from '../services/api';
import { queueService } from '../services/queueService';
import { patientsService } from '../services/patientsService';
import { doctorsService } from '../services/doctorsService';
import { appointmentsService } from '../services/appointmentsService';

import { Patient, Doctor } from '../types';

interface AppointmentFormProps {
  onSuccess: () => void;
  editData?: any;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    patient_id: editData?.patient_id?.toString() || '',
    doctor_id: editData?.doctor_id?.toString() || '',
    appointment_date: editData?.appointment_date || '',
    appointment_time: editData?.appointment_time || '',
    duration_minutes: editData?.duration_minutes?.toString() || '30',
    notes: editData?.notes || ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      loadAvailableSlots();
    }
  }, [formData.doctor_id, formData.appointment_date]);

  const loadPatients = async () => {
    try {
      const data = await patientsService.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await doctorsService.getAll();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const slots = await appointmentsService.getAvailableSlots(
        parseInt(formData.doctor_id),
        formData.appointment_date
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        duration_minutes: parseInt(formData.duration_minutes),
        notes: formData.notes || undefined
      };

      if (editData) {
        await appointmentsService.update(editData.id, appointmentData);
      } else {
        await appointmentsService.create(appointmentData);
      }
      
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Select
        label="Patient"
        value={formData.patient_id}
        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
        options={patients.map(p => ({ value: p.id.toString(), label: `${p.name} (${p.phone})` }))}
        required
      />

      <Select
        label="Doctor"
        value={formData.doctor_id}
        onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
        options={doctors.map(d => ({ value: d.id.toString(), label: `${d.name} - ${d.specialization}` }))}
        required
      />

      <Input
        label="Appointment Date"
        type="date"
        value={formData.appointment_date}
        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
        required
        className="min-w-0"
      />

      {availableSlots.length > 0 && (
        <Select
          label="Available Time Slots"
          value={formData.appointment_time}
          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
          options={availableSlots.map(slot => ({ value: slot, label: slot }))}
          required
        />
      )}

      {formData.doctor_id && formData.appointment_date && availableSlots.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          No available slots for the selected doctor and date.
        </div>
      )}

      <Input
        label="Duration (minutes)"
        type="number"
        value={formData.duration_minutes}
        onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" disabled={loading || availableSlots.length === 0}>
          {loading ? 'Saving...' : editData ? 'Update Appointment' : 'Book Appointment'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;