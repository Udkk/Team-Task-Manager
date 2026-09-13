
import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  ClipboardList,
  Circle,
  LoaderCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';
import LoadingState from '../components/LoadingState.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const columns = [
  {
    label: 'TO DO',
    status: 'TODO',
    icon: Circle,
    accent: 'text-slate-400',
    dot: 'bg-slate-400'
  },
  {
    label: 'IN PROGRESS',
    status: 'IN_PROGRESS',
    icon: LoaderCircle,
    accent: 'text-amber-400',
    dot: 'bg-amber-400'
  },
  {
    label: 'DONE',
    status: 'DONE',
    icon: CheckCircle2,
    accent: 'text-emerald-400',
    dot: 'bg-emerald-400'
  }
];

const initialTaskForm = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: '',
  dueDate: ''
};

const getId = (value) => value?._id || value?.id || value;

const getErrorMessage = (apiError, fallback) => {
  const validationMessage = apiError.response?.data?.errors
    ?.map((item) => item.message)
    .join(', ');

  return validationMessage || apiError.response?.data?.message || fallback;
};

const TaskBoard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [assignInputs, setAssignInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const groupedTasks = useMemo(() => {
    return columns.reduce((groups, column) => {
      groups[column.status] = tasks.filter(
        (task) => task.status === column.status
      );

      return groups;
    }, {});
  }, [tasks]);

  const fetchBoardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const requests = [api.get('/tasks')];

      if (isAdmin) {
        requests.push(api.get('/projects'));
        requests.push(api.get('/users'));
      }

      const [tasksResponse, projectsResponse, usersResponse] =
        await Promise.all(requests);

      setTasks(tasksResponse.data);
      setProjects(projectsResponse?.data || []);
      setUsers(usersResponse?.data || []);
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to load tasks'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [isAdmin]);

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setIsCreating(true);

    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate || undefined
      };

      const { data } = await api.post('/tasks', payload);

      setTasks((currentTasks) => [data, ...currentTasks]);
      setTaskForm(initialTaskForm);
      setMessage('Task created successfully');
      setShowCreateForm(false);
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to create task'));
    } finally {
      setIsCreating(false);
    }
  };

  const updateTaskInState = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        getId(task) === getId(updatedTask) ? updatedTask : task
      )
    );
  };

  const handleStatusChange = async (taskId, status) => {
    setError('');
    setMessage('');

    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, {
        status
      });

      updateTaskInState(data);
      setMessage('Task updated');
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to update task'));
    }
  };

  const handleAssignInput = (taskId, value) => {
    setAssignInputs((currentInputs) => ({
      ...currentInputs,
      [taskId]: value
    }));
  };

  const handleAssignTask = async (event, taskId) => {
    event.preventDefault();

    setError('');
    setMessage('');

    const userId = assignInputs[taskId]?.trim();

    if (!userId) {
      setError('Assigned user is required');
      return;
    }

    try {
      const { data } = await api.patch(`/tasks/${taskId}/assign`, {
        assignedTo: userId
      });

      updateTaskInState(data);

      setAssignInputs((currentInputs) => ({
        ...currentInputs,
        [taskId]: ''
      }));

      setMessage('Task assigned');
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to assign task'));
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError('');
    setMessage('');

    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => getId(task) !== taskId)
      );

      setMessage('Task deleted');
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to delete task'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
              <ClipboardList size={16} />
              <span>Task Management</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Task Board
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {isAdmin
                ? 'Create, assign, and track your team’s work.'
                : 'Track and manage the tasks assigned to you.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5">
              <p className="text-xs text-slate-500">Total tasks</p>
              <p className="text-lg font-bold text-white">{tasks.length}</p>
            </div>

            {isAdmin && (
              <button
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                type="button"
                onClick={() => setShowCreateForm((current) => !current)}
              >
                <Plus size={18} />
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      <Alert>{message}</Alert>
      <Alert type="error">{error}</Alert>

      {/* Create Task */}
      {isAdmin && showCreateForm && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-white">
              Create New Task
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add a task and assign it to a project member.
            </p>
          </div>

          <form
            className="grid gap-4 lg:grid-cols-2"
            onSubmit={handleCreateTask}
          >
            <input
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              name="title"
              placeholder="Task title"
              value={taskForm.title}
              onChange={handleTaskFormChange}
              required
            />

            <select
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-500"
              name="projectId"
              value={taskForm.projectId}
              onChange={handleTaskFormChange}
              required
            >
              <option value="">Select project</option>

              {projects.map((project) => (
                <option key={getId(project)} value={getId(project)}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-500"
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleTaskFormChange}
              required
            >
              <option value="">Assign to</option>

              {users.map((availableUser) => (
                <option key={availableUser._id} value={availableUser._id}>
                  {availableUser.name} ({availableUser.email})
                </option>
              ))}
            </select>

            <input
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-500"
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={handleTaskFormChange}
            />

            <textarea
              className="min-h-24 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 lg:col-span-2"
              name="description"
              placeholder="Task description"
              value={taskForm.description}
              onChange={handleTaskFormChange}
            />

            <div className="flex gap-3 lg:col-span-2">
              <button
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Task'}
              </button>

              <button
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                type="button"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Board */}
      {isLoading ? (
        <LoadingState label="Loading tasks..." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const Icon = column.icon;
            const columnTasks = groupedTasks[column.status] || [];

            return (
              <section
                key={column.status}
                className="min-h-[32rem] rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >
                {/* Column header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 ${column.accent}`}
                    >
                      <Icon size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {column.label}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {columnTasks.length}{' '}
                        {columnTasks.length === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold ${column.accent}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                  {columnTasks.map((task) => {
                    const taskId = getId(task);

                    return (
                      <TaskCard
                        key={taskId}
                        assignValue={assignInputs[taskId] || ''}
                        isAdmin={isAdmin}
                        onAssignChange={(event) =>
                          handleAssignInput(taskId, event.target.value)
                        }
                        onAssignSubmit={(event) =>
                          handleAssignTask(event, taskId)
                        }
                        onDelete={() => handleDeleteTask(taskId)}
                        onStatusChange={(event) =>
                          handleStatusChange(taskId, event.target.value)
                        }
                        task={task}
                        users={users}
                      />
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-5 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-600">
                        <RefreshCw size={17} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        No tasks here
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Tasks will appear here when their status changes.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;

