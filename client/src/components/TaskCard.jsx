const statusClasses = {
  TODO: 'border-slate-200 bg-slate-100 text-slate-700',
  IN_PROGRESS: 'border-blue-200 bg-blue-50 text-blue-700',
  DONE: 'border-sky-200 bg-sky-50 text-sky-700'
};

const formatDate = (date) => {
  if (!date) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

const TaskCard = ({
  assignValue,
  isAdmin,
  onAssignChange,
  onAssignSubmit,
  onDelete,
  onStatusChange,
  task,
  users
}) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-950">{task.title}</h4>
          {task.description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {task.description}
            </p>
          )}
        </div>

        {isAdmin && (
          <button
            className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusClasses[task.status]}`}
        >
          {task.status}
        </span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
          {task.assignedTo?.name || 'Unassigned'}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Project</dt>
          <dd className="text-right font-medium text-slate-700">
            {task.projectId?.name || 'Project'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Due</dt>
          <dd className="text-right font-medium text-slate-700">
            {formatDate(task.dueDate)}
          </dd>
        </div>
      </dl>

      <select
        className="mt-4 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={task.status}
        onChange={onStatusChange}
      >
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      {isAdmin && (
        <form className="mt-3 flex gap-2" onSubmit={onAssignSubmit}>
          <select
            className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            value={assignValue}
            onChange={onAssignChange}
            required
          >
            <option value="">Assignee</option>
            {users.map((availableUser) => (
              <option key={availableUser._id} value={availableUser._id}>
                {availableUser.name}
              </option>
            ))}
          </select>
          <button
            className="rounded-md border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            type="submit"
          >
            Assign
          </button>
        </form>
      )}
    </article>
  );
};

export default TaskCard;
