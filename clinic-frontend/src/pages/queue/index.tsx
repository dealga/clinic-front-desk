// src/pages/queue/index.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
// import { queueService, patientsService } from '../../services/queueService';
import { queueService } from '../../services/queueService';
import { patientsService } from '../../services/patientsService';
import { QueueEntry } from '../../types';
import AddToQueueForm from '../../components/AddToQueueForm';

const QueuePage: React.FC = () => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadQueue();
  }, [filter]);

  const loadQueue = async () => {
    try {
      const data = await queueService.getAll(filter ? { status: filter } : undefined);
      setQueue(data);
    } catch (error) {
      console.error('Error loading queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await queueService.update(id, { status });
      loadQueue();
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const updatePriority = async (id: number, priority: string) => {
    try {
      await queueService.update(id, { priority });
      loadQueue();
    } catch (error) {
      console.error('Error updating queue priority:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'with_doctor': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Queue Management</h1>
          <Button onClick={() => setShowAddModal(true)}>
            Add to Queue
          </Button>
        </div>

        <div className="mb-6 flex space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="with_doctor">With Doctor</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queue.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{entry.queue_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.patient.name}</div>
                      <div className="text-sm text-gray-500">{entry.patient.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={entry.priority}
                      onChange={(e) => updatePriority(entry.id, e.target.value)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(entry.priority)}`}
                      disabled={entry.status === 'completed' || entry.status === 'cancelled'}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={entry.status}
                      onChange={(e) => updateStatus(entry.id, e.target.value)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(entry.status)}`}
                    >
                      <option value="waiting">Waiting</option>
                      <option value="with_doctor">With Doctor</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.doctor ? entry.doctor.name : 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {/* Handle edit */}}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {queue.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No queue entries found</p>
            </div>
          )}
        </div>

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Patient to Queue"
        >
          <AddToQueueForm 
            onSuccess={() => {
              setShowAddModal(false);
              loadQueue();
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default QueuePage;