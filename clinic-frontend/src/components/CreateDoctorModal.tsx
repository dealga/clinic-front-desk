// src/components/CreateDoctorModal.tsx
import React, { useState } from 'react';
import Button from './Button';
import { doctorsService } from '../services/doctorsService';
import { Doctor } from '../types';

interface CreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDoctorCreated: (doctor: Doctor) => void;
}

interface CreateDoctorForm {
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  phone: string;
  email: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  is_active: boolean;
}

const CreateDoctorModal: React.FC<CreateDoctorModalProps> = ({
  isOpen,
  onClose,
  onDoctorCreated,
}) => {
  const [formData, setFormData] = useState<CreateDoctorForm>({
    name: '',
    specialization: '',
    gender: 'male',
    location: '',
    phone: '',
    email: '',
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateDoctorForm>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateDoctorForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvailabilityChange = (day: keyof typeof formData.availability, timeSlots: string[]) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: timeSlots
      }
    }));
  };

  const addTimeSlot = (day: keyof typeof formData.availability) => {
    const newSlot = '09:00-17:00';
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], newSlot]
      }
    }));
  };

  const removeTimeSlot = (day: keyof typeof formData.availability, index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (day: keyof typeof formData.availability, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].map((slot, i) => i === index ? value : slot)
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDoctorForm> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const doctorData = {
        ...formData,
        // Convert empty strings to null for optional fields
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        // Convert availability object to JSON string, only include days with time slots
        availability: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData.availability).filter(([_, slots]) => slots.length > 0)
          )
        ) || null,
      };
      
      const newDoctor = await doctorsService.create(doctorData);
      onDoctorCreated(newDoctor);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        specialization: '',
        gender: 'male',
        location: '',
        phone: '',
        email: '',
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        is_active: true,
      });
    } catch (error) {
      console.error('Error creating doctor:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Doctor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter doctor's full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Specialization */}
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.specialization ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Cardiology, Dermatology, etc."
            />
            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., New York, NY"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., +1-234-567-8900"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="doctor@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability Schedule
            </label>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {Object.entries(formData.availability).map(([day, timeSlots]) => (
                <div key={day} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </span>
                    <button
                      type="button"
                      onClick={() => addTimeSlot(day as keyof typeof formData.availability)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Time
                    </button>
                  </div>
                  
                  {timeSlots.length === 0 ? (
                    <p className="text-gray-400 text-sm">No availability set</p>
                  ) : (
                    <div className="space-y-2">
                      {timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={slot}
                            onChange={(e) => updateTimeSlot(day as keyof typeof formData.availability, index, e.target.value)}
                            placeholder="09:00-17:00"
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(day as keyof typeof formData.availability, index)}
                            className="text-red-600 hover:text-red-800 text-sm px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: HH:MM-HH:MM (e.g., 09:00-17:00, 14:00-18:00)
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="flex-1"
            >
              Create Doctor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctorModal;