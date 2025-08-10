import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateDoctorModal from '../../components/CreateDoctorModal';
import { doctorsService } from '../../services/doctorsService';
import { Doctor } from '../../types';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingDoctorId, setDeletingDoctorId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    location: ''
  });

  useEffect(() => {
    loadDoctors();
  }, [filters]);

  const loadDoctors = async () => {
    try {
      const data = await doctorsService.getAll(filters);
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorCreated = (newDoctor: Doctor) => {
    // Add the new doctor to the list without needing to refetch
    setDoctors(prevDoctors => [newDoctor, ...prevDoctors]);
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      return;
    }

    setDeletingDoctorId(doctorId);
    try {
      await doctorsService.delete(doctorId);
      setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== doctorId));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    } finally {
      setDeletingDoctorId(null);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Doctors</h1>
          <Button onClick={openCreateModal}>
            + Add Doctor
          </Button>
        </div>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Search doctors..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Specialization..."
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    disabled={deletingDoctorId === doctor.id}
                    loading={deletingDoctorId === doctor.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-gray-600 flex items-center">
                  <span className="inline-block w-4 h-4 mr-2">📍</span>
                  {doctor.location}
                </p>
                <p className="text-gray-600 capitalize">
                  <span className="inline-block w-4 h-4 mr-2">👤</span>
                  {doctor.gender}
                </p>
                
                {doctor.phone && (
                  <p className="text-gray-600 flex items-center">
                    <span className="inline-block w-4 h-4 mr-2">📞</span>
                    {doctor.phone}
                  </p>
                )}
                
                {doctor.email && (
                  <p className="text-gray-600 flex items-center">
                    <span className="inline-block w-4 h-4 mr-2">📧</span>
                    {doctor.email}
                  </p>
                )}
                
                {doctor.availability && (
                  <div className="mt-3">
                    <p className="text-gray-700 text-sm font-medium">Availability:</p>
                    <div className="text-gray-600 text-sm">
                      {(() => {
                        try {
                          const availability = typeof doctor.availability === 'string' 
                            ? JSON.parse(doctor.availability) 
                            : doctor.availability;
                          
                          const days = Object.entries(availability)
                            .filter(([_, slots]) => Array.isArray(slots) && slots.length > 0)
                            .map(([day, slots]) => {
                              const dayName = day.charAt(0).toUpperCase() + day.slice(1, 3);
                              const timeSlots = (slots as string[]).join(', ');
                              return `${dayName}: ${timeSlots}`;
                            });
                          
                          return days.length > 0 ? days.join(' • ') : 'No schedule set';
                        } catch {
                          return doctor.availability;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  {/* <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      // Handle view/edit doctor
                      console.log('View doctor:', doctor.id);
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Handle book appointment
                      console.log('Book appointment with:', doctor.id);
                    }}
                  >
                    Book Appointment
                  </Button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 text-lg mb-4">No doctors found</p>
            <p className="text-gray-400 mb-6">
              {Object.values(filters).some(filter => filter) 
                ? 'Try adjusting your search filters' 
                : 'Get started by adding your first doctor'}
            </p>
            {!Object.values(filters).some(filter => filter) && (
              <Button onClick={openCreateModal}>
                + Add First Doctor
              </Button>
            )}
          </div>
        )}

        {/* Create Doctor Modal */}
        <CreateDoctorModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onDoctorCreated={handleDoctorCreated}
        />
      </div>
    </Layout>
  );
};

export default DoctorsPage;