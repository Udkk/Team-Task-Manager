import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';

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

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      description: 'All tasks',
      icon: ClipboardList,
      iconStyle: 'bg-cyan-500/10 text-cyan-400',
      valueStyle: 'text-white'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      description: 'Finished tasks',
      icon: CheckCircle2,
      iconStyle: 'bg-emerald-500/10 text-emerald-400',
      valueStyle: 'text-emerald-400'
    },
    {
      label: 'Pending',
      value: stats.pendingTasks,
      description: 'Needs attention',
      icon: Clock3,
      iconStyle: 'bg-amber-500/10 text-amber-400',
      valueStyle: 'text-amber-400'
    },
    {
      label: 'Overdue',
      value: stats.overdueTasks,
      description: 'Past the deadline',
      icon: AlertTriangle,
      iconStyle: 'bg-rose-500/10 text-rose-400',
      valueStyle: 'text-rose-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <TrendingUp size={16} />
            <span>Workspace Overview</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Keep track of your team's tasks, progress, and deadlines from one
            place.
          </p>
        </div>
      </div>

      <Alert type="error">{error}</Alert>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {item.label}
                  </p>

                  <p
                    className={`mt-3 text-4xl font-bold tracking-tight ${
                      isLoading ? 'text-slate-600' : item.valueStyle
                    }`}
                  >
                    {isLoading ? '—' : item.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconStyle}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Completion card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Task Progress
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Overall completion across your tasks
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">
                {isLoading ? '—' : `${completionRate}%`}
              </p>

              <p className="text-xs text-slate-500">completed</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-700"
                style={{
                  width: isLoading ? '0%' : `${completionRate}%`
                }}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-semibold text-emerald-400">
                {isLoading ? '—' : stats.completedTasks}
              </p>
              <p className="mt-1 text-xs text-slate-500">Completed</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-amber-400">
                {isLoading ? '—' : stats.pendingTasks}
              </p>
              <p className="mt-1 text-xs text-slate-500">Pending</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-rose-400">
                {isLoading ? '—' : stats.overdueTasks}
              </p>
              <p className="mt-1 text-xs text-slate-500">Overdue</p>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">
            Quick Summary
          </h3>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total workload</span>
              <span className="font-semibold text-white">
                {isLoading ? '—' : stats.totalTasks}
              </span>
            </div>

            <div className="h-px bg-slate-800" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Completed</span>
              <span className="font-semibold text-emerald-400">
                {isLoading ? '—' : stats.completedTasks}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Needs attention</span>
              <span className="font-semibold text-amber-400">
                {isLoading ? '—' : stats.pendingTasks}
              </span>
            </div>

            <div className="h-px bg-slate-800" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Overdue</span>
              <span className="font-semibold text-rose-400">
                {isLoading ? '—' : stats.overdueTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

