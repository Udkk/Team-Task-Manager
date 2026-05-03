import { useEffect, useMemo, useState } from 'react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';
import FormContainer from '../components/FormContainer.jsx';
import LoadingState from '../components/LoadingState.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const columns = [
  { label: 'TODO', status: 'TODO' },
  { label: 'IN PROGRESS', status: 'IN_PROGRESS' },
  { label: 'DONE', status: 'DONE' }
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const inputClassName =
    'rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100';
  const buttonClassName =
    'rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-400';

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
      setMessage('Task created');
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
    <>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">Task board</h2>
          <p className="mt-1 text-sm text-stone-600">
            {tasks.length} assigned {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {isAdmin && (
          <FormContainer className="w-full xl:max-w-5xl">
            <form
              className="grid gap-3 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]"
              onSubmit={handleCreateTask}
            >
              <input
                className={inputClassName}
                name="title"
                placeholder="Task title"
                value={taskForm.title}
                onChange={handleTaskFormChange}
                required
              />
              <select
                className={inputClassName}
                name="projectId"
                value={taskForm.projectId}
                onChange={handleTaskFormChange}
                required
              >
                <option value="">Project</option>
                {projects.map((project) => (
                  <option key={getId(project)} value={getId(project)}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                className={inputClassName}
                name="assignedTo"
                value={taskForm.assignedTo}
                onChange={handleTaskFormChange}
                required
              >
                <option value="">Assignee</option>
                {users.map((availableUser) => (
                  <option key={availableUser._id} value={availableUser._id}>
                    {availableUser.name} ({availableUser.email})
                  </option>
                ))}
              </select>
              <input
                className={inputClassName}
                name="dueDate"
                type="date"
                value={taskForm.dueDate}
                onChange={handleTaskFormChange}
              />
              <button
                className={buttonClassName}
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
              <input
                className={`xl:col-span-5 ${inputClassName}`}
                name="description"
                placeholder="Description"
                value={taskForm.description}
                onChange={handleTaskFormChange}
              />
            </form>
          </FormContainer>
        )}
      </div>

      <Alert>{message}</Alert>
      <Alert type="error">{error}</Alert>

      {isLoading ? (
        <LoadingState label="Loading tasks..." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <section
              className="min-h-[28rem] rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
              key={column.status}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-950">
                  {column.label}
                </h3>
                <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600">
                  {groupedTasks[column.status]?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {groupedTasks[column.status]?.map((task) => {
                  const taskId = getId(task);

                  return (
                    <TaskCard
                      assignValue={assignInputs[taskId] || ''}
                      isAdmin={isAdmin}
                      key={taskId}
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
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
};

export default TaskBoard;
