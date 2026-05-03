import { useEffect, useState } from 'react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';
import Card from '../components/Card.jsx';

const initialStats = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  overdueTasks: 0
};

const Dashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (apiError) {
        setError(
          apiError.response?.data?.message || 'Unable to load dashboard data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statItems = [
    { label: 'Total tasks', tone: 'teal', value: stats.totalTasks },
    { label: 'Completed', tone: 'emerald', value: stats.completedTasks },
    { label: 'Pending', tone: 'amber', value: stats.pendingTasks },
    { label: 'Overdue', tone: 'rose', value: stats.overdueTasks }
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-950">Dashboard</h2>
        <p className="mt-1 text-sm text-stone-600">
          Overview for your assigned work.
        </p>
      </div>

      <Alert type="error">{error}</Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card
            key={item.label}
            label={item.label}
            tone={item.tone}
            value={isLoading ? '...' : item.value}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
