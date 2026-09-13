
import { useEffect, useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  UserPlus,
  Layers3
} from 'lucide-react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const getId = (value) => value?._id || value?.id || value;

const getErrorMessage = (apiError, fallback) => {
  const validationMessage = apiError.response?.data?.errors
    ?.map((item) => item.message)
    .join(', ');

  return validationMessage || apiError.response?.data?.message || fallback;
};

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [availableUsersByProject, setAvailableUsersByProject] = useState({});
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: ''
  });
  const [memberInputs, setMemberInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const fetchAvailableUsers = async (projectId) => {
    const { data } = await api.get(`/projects/${projectId}/available-users`);
    return data;
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.get('/projects');

      setProjects(data);

      if (isAdmin) {
        const entries = await Promise.all(
          data
            .filter((project) => getId(project.createdBy) === user?.id)
            .map(async (project) => {
              const projectId = getId(project);
              const availableUsers = await fetchAvailableUsers(projectId);

              return [projectId, availableUsers];
            })
        );

        setAvailableUsersByProject(Object.fromEntries(entries));
      } else {
        setAvailableUsersByProject({});
      }
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to load projects'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [isAdmin, user?.id]);

  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setIsCreating(true);

    try {
      const { data } = await api.post('/projects', projectForm);
      const projectId = getId(data);
      const availableUsers = await fetchAvailableUsers(projectId);

      setProjects((currentProjects) => [data, ...currentProjects]);

      setAvailableUsersByProject((currentUsers) => ({
        ...currentUsers,
        [projectId]: availableUsers
      }));

      setProjectForm({
        name: '',
        description: ''
      });

      setMessage('Project created');
      setShowCreateForm(false);
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to create project'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleMemberInput = (projectId, value) => {
    setMemberInputs((currentInputs) => ({
      ...currentInputs,
      [projectId]: value
    }));
  };

  const handleAddMember = async (event, projectId) => {
    event.preventDefault();

    setError('');
    setMessage('');

    const userId = memberInputs[projectId]?.trim();

    if (!userId) {
      setError('Member is required');
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/add-member`, {
        userId
      });

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          getId(project) === projectId ? data : project
        )
      );

      setMemberInputs((currentInputs) => ({
        ...currentInputs,
        [projectId]: ''
      }));

      setAvailableUsersByProject((currentUsers) => ({
        ...currentUsers,
        [projectId]: (currentUsers[projectId] || []).filter(
          (availableUser) => availableUser._id !== userId
        )
      }));

      setMessage('Member added');
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to add member'));
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
              <FolderKanban size={16} />
              <span>Workspace</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Projects
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Organize your team's work and manage project members.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5">
              <p className="text-xs text-slate-500">Active projects</p>
              <p className="text-lg font-bold text-white">{projects.length}</p>
            </div>

            {isAdmin && (
              <button
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                type="button"
                onClick={() => setShowCreateForm((current) => !current)}
              >
                <Plus size={18} />
                New Project
              </button>
            )}
          </div>
        </div>
      </div>

      <Alert>{message}</Alert>
      <Alert type="error">{error}</Alert>

      {/* Create project */}
      {isAdmin && showCreateForm && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-white">
              Create New Project
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create a workspace for your team's tasks.
            </p>
          </div>

          <form
            className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto]"
            onSubmit={handleCreateProject}
          >
            <input
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              name="name"
              placeholder="Project name"
              value={projectForm.name}
              onChange={handleProjectChange}
              required
            />

            <input
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              name="description"
              placeholder="Project description"
              value={projectForm.description}
              onChange={handleProjectChange}
            />

            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={isCreating}
              >
                <Plus size={17} />
                {isCreating ? 'Creating...' : 'Create'}
              </button>

              <button
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                type="button"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects */}
      {isLoading ? (
        <LoadingState label="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-600">
            <Layers3 size={20} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-300">
            No projects yet
          </h3>

          <p className="mt-1 max-w-sm text-xs text-slate-600">
            {isAdmin
              ? 'Create your first project to start organizing tasks.'
              : 'Projects assigned to you will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => {
            const projectId = getId(project);
            const creatorId = getId(project.createdBy);
            const canAddMember = creatorId === user?.id;
            const availableUsers =
              availableUsersByProject[projectId] || [];

            return (
              <div
                key={projectId}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-1 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl"
              >
                <ProjectCard project={project}>
                  {canAddMember && (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <UserPlus size={16} className="text-cyan-400" />

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Add team member
                          </p>

                          <p className="text-xs text-slate-600">
                            Invite an available user to this project.
                          </p>
                        </div>
                      </div>

                      <form
                        className="flex flex-col gap-3 sm:flex-row"
                        onSubmit={(event) =>
                          handleAddMember(event, projectId)
                        }
                      >
                        <select
                          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500"
                          value={memberInputs[projectId] || ''}
                          onChange={(event) =>
                            handleMemberInput(
                              projectId,
                              event.target.value
                            )
                          }
                          required
                        >
                          <option value="">
                            {availableUsers.length
                              ? 'Select member'
                              : 'No users available'}
                          </option>

                          {availableUsers.map((availableUser) => (
                            <option
                              key={availableUser._id}
                              value={availableUser._id}
                            >
                              {availableUser.name} ({availableUser.email})
                            </option>
                          ))}
                        </select>

                        <button
                          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 px-4 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
                          type="submit"
                          disabled={!availableUsers.length}
                        >
                          <Users size={16} />
                          Add Member
                        </button>
                      </form>
                    </div>
                  )}
                </ProjectCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
