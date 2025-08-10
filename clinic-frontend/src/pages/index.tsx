import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { queueService } from '../services/queueService';

const Dashboard: React.FC = () => {
  const [queueStats, setQueueStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueueStats();
  }, []);

  const loadQueueStats = async () => {
    try {
      const stats = await queueService.getStats();
      setQueueStats(stats);
    } catch (error) {
      console.error('Error loading queue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Waiting', count: queueStats.waiting || 0, color: 'bg-yellow-500' },
    { title: 'With Doctor', count: queueStats.with_doctor || 0, color: 'bg-blue-500' },
    { title: 'Completed', count: queueStats.completed || 0, color: 'bg-green-500' },
    { title: 'Cancelled', count: queueStats.cancelled || 0, color: 'bg-red-500' }
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                  {loading ? '...' : stat.count}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Queue Status</p>
                  <p className="text-lg font-semibold">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/queue" className="block p-3 bg-primary-50 rounded hover:bg-primary-100">
                <h3 className="font-medium">Manage Queue</h3>
                <p className="text-sm text-gray-600">Add patients to queue and update status</p>
              </a>
              <a href="/appointments" className="block p-3 bg-primary-50 rounded hover:bg-primary-100">
                <h3 className="font-medium">Book Appointment</h3>
                <p className="text-sm text-gray-600">Schedule new appointments</p>
              </a>
              <a href="/doctors" className="block p-3 bg-primary-50 rounded hover:bg-primary-100">
                <h3 className="font-medium">Manage Doctors</h3>
                <p className="text-sm text-gray-600">Add or edit doctor profiles</p>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Today's Summary</h2>
            <div className="space-y-2">
              {/* <p>Total patients in queue: <span className="font-medium">{Object.values(queueStats).reduce((a: any, b: any) => a + b, 0)}</span></p> */}
              <p>
  Total patients in queue:{" "}
  <span className="font-medium">
    {Object.values(queueStats as Record<string, number>).reduce(
      (a, b) => a + b,
      0
    )}
  </span>
</p>

              <p>Current time: <span className="font-medium">{new Date().toLocaleTimeString()}</span></p>
              <p>Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
