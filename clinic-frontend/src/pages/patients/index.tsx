// src/pages/patients/index.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import CreatePatientModal from '../../components/CreatePatientModal';
import { patientsService } from '../../services/patientsService';
import { Patient } from '../../types';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null);

  useEffect(() => {
    loadPatients();
  }, [search]);

  const loadPatients = async () => {
    try {
      const data = await patientsService.getAll(search);
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientCreated = (newPatient: Patient) => {
    // Add the new patient to the list without needing to refetch
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };

  const handleDeletePatient = async (patientId: number) => {
    if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }

    setDeletingPatientId(patientId);
    try {
      await patientsService.delete(patientId);
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again.');
    } finally {
      setDeletingPatientId(null);
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
          <h1 className="text-3xl font-bold">Patients</h1>
          <Button onClick={openCreateModal}>
            + Add Patient
          </Button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.age || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {patient.gender || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeletePatient(patient.id)}
                      disabled={deletingPatientId === patient.id}
                      loading={deletingPatientId === patient.id}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {patients.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg mb-4">No patients found</p>
              <p className="text-gray-400 mb-6">
                {search 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by adding your first patient'}
              </p>
              {!search && (
                <Button onClick={openCreateModal}>
                  + Add First Patient
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Create Patient Modal */}
        <CreatePatientModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onPatientCreated={handlePatientCreated}
        />
      </div>
    </Layout>
  );
};

export default PatientsPage;