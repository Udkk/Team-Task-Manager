import { useEffect, useState } from 'react';

import api from '../api/axios.js';
import Alert from '../components/Alert.jsx';
import FormContainer from '../components/FormContainer.jsx';
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const inputClassName =
    'rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100';
  const buttonClassName =
    'rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-400';
  const secondaryButtonClassName =
    'rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400 disabled:hover:bg-white';

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
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">Projects</h2>
          <p className="mt-1 text-sm text-stone-600">
            {projects.length} active{' '}
            {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {isAdmin && (
          <FormContainer className="w-full lg:max-w-2xl">
            <form
              className="grid gap-3 lg:grid-cols-[1fr_1.5fr_auto]"
              onSubmit={handleCreateProject}
            >
              <input
                className={inputClassName}
                name="name"
                placeholder="Project name"
                value={projectForm.name}
                onChange={handleProjectChange}
                required
              />
              <input
                className={inputClassName}
                name="description"
                placeholder="Description"
                value={projectForm.description}
                onChange={handleProjectChange}
              />
              <button
                className={buttonClassName}
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </FormContainer>
        )}
      </div>

      <Alert>{message}</Alert>
      <Alert type="error">{error}</Alert>

      {isLoading ? (
        <LoadingState label="Loading projects..." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => {
            const projectId = getId(project);
            const creatorId = getId(project.createdBy);
            const canAddMember = creatorId === user?.id;
            const availableUsers = availableUsersByProject[projectId] || [];

            return (
              <ProjectCard key={projectId} project={project}>
                {canAddMember && (
                  <form
                    className="mt-5 flex flex-col gap-3 sm:flex-row"
                    onSubmit={(event) => handleAddMember(event, projectId)}
                  >
                    <select
                      className={`min-w-0 flex-1 ${inputClassName}`}
                      value={memberInputs[projectId] || ''}
                      onChange={(event) =>
                        handleMemberInput(projectId, event.target.value)
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
                      className={secondaryButtonClassName}
                      type="submit"
                      disabled={!availableUsers.length}
                    >
                      Add member
                    </button>
                  </form>
                )}
              </ProjectCard>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Projects;
