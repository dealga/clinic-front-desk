// src/components/AddToQueueForm.tsx
import React, { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
// import { patientsService, queueService, doctorsService } from '../services/api';
import { queueService } from '../services/queueService';
import { patientsService } from '../services/patientsService';
import { doctorsService } from '../services/doctorsService';
import { Patient, Doctor } from '../types';

interface AddToQueueFormProps {
  onSuccess: () => void;
}

const AddToQueueForm: React.FC<AddToQueueFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    priority: 'normal',
    notes: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

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

  const handlePatientSearch = async (phone: string) => {
    if (phone.length >= 10) {
      try {
        const patient = await patientsService.getByPhone(phone);
        if (patient) {
          setFormData({ ...formData, patient_id: patient.id.toString() });
          setShowNewPatient(false);
        } else {
          setNewPatient({ ...newPatient, phone });
          setShowNewPatient(true);
        }
      } catch (error) {
        setNewPatient({ ...newPatient, phone });
        setShowNewPatient(true);
      }
    }
  };

  const createNewPatient = async () => {
    try {
      const patient = await patientsService.create({
        ...newPatient,
        age: newPatient.age ? parseInt(newPatient.age) : undefined
      });
      setFormData({ ...formData, patient_id: patient.id.toString() });
      setPatients([...patients, patient]);
      setShowNewPatient(false);
      setNewPatient({ name: '', phone: '', email: '', age: '', gender: '' });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create patient');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await queueService.create({
        patient_id: parseInt(formData.patient_id),
        doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : undefined,
        priority: formData.priority,
        notes: formData.notes || undefined
      });
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add to queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient Phone Number
        </label>
        <input
          type="tel"
          placeholder="Search by phone number"
          onChange={(e) => handlePatientSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {!showNewPatient && (
        <Select
          label="Patient"
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
          options={patients.map(p => ({ value: p.id.toString(), label: `${p.name} (${p.phone})` }))}
          required
        />
      )}

      {showNewPatient && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">New Patient Information</h3>
          <Input
            label="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          />
          <Input
            label="Age"
            type="number"
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          />
          <Select
            label="Gender"
            value={newPatient.gender}
            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />
          <Button type="button" onClick={createNewPatient} size="sm">
            Create Patient
          </Button>
        </div>
      )}

      <Select
        label="Doctor (Optional)"
        value={formData.doctor_id}
        onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
        options={doctors.map(d => ({ value: d.id.toString(), label: `${d.name} - ${d.specialization}` }))}
        placeholder="Select a doctor"
      />

      <Select
        label="Priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        options={[
          { value: 'normal', label: 'Normal' },
          { value: 'urgent', label: 'Urgent' },
          { value: 'emergency', label: 'Emergency' }
        ]}
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
        <Button type="submit" disabled={loading || !formData.patient_id}>
          {loading ? 'Adding...' : 'Add to Queue'}
        </Button>
      </div>
    </form>
  );
};

export default AddToQueueForm;