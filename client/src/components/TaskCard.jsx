
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Trash2,
  UserRound,
  FolderKanban
} from 'lucide-react';

const statusConfig = {
  TODO: {
    label: 'To Do',
    className: 'border-slate-700 bg-slate-800 text-slate-300',
    dot: 'bg-slate-400'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    dot: 'bg-amber-400'
  },
  DONE: {
    label: 'Completed',
    className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    dot: 'bg-emerald-400'
  }
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

const isOverdue = (date, status) => {
  if (!date || status === 'DONE') {
    return false;
  }

  return new Date(date) < new Date();
};

const getInitial = (name) => {
  if (!name) {
    return '?';
  }

  return name.charAt(0).toUpperCase();
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
  const status = statusConfig[task.status] || statusConfig.TODO;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {isAdmin && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
            type="button"
            onClick={onDelete}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Title */}
      <div className="mt-4">
        <h4 className="text-base font-semibold leading-6 text-white">
          {task.title}
        </h4>

        {task.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
            {task.description}
          </p>
        )}
      </div>

      {/* Project */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <FolderKanban size={15} className="text-cyan-400" />
        <span className="truncate text-slate-300">
          {task.projectId?.name || 'Project'}
        </span>
      </div>

      {/* Assignee + Due date */}
      <div className="mt-4 grid gap-3 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400">
              {getInitial(task.assignedTo?.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">Assigned to</p>
              <p className="truncate text-sm font-medium text-slate-300">
                {task.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
          </div>

          <UserRound size={16} className="shrink-0 text-slate-600" />
        </div>

        <div
          className={`flex items-center gap-2 text-sm ${
            overdue ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <CalendarDays size={15} />

          <span>
            {overdue ? `Overdue · ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Status control */}
      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-slate-500">
          Update status
        </label>

        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-300 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
          value={task.status}
          onChange={onStatusChange}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
      </div>

      {/* Admin assignment */}
      {isAdmin && (
        <form
          className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
          onSubmit={onAssignSubmit}
        >
          <label className="mb-2 block text-xs font-medium text-slate-500">
            Assign task
          </label>

          <div className="flex gap-2">
            <select
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500"
              value={assignValue}
              onChange={onAssignChange}
              required
            >
              <option value="">Select member</option>

              {users.map((availableUser) => (
                <option key={availableUser._id} value={availableUser._id}>
                  {availableUser.name}
                </option>
              ))}
            </select>

            <button
              className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
            >
              Assign
            </button>
          </div>
        </form>
      )}

      {/* Completion indicator */}
      {task.status === 'DONE' && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400">
          <CheckCircle2 size={15} />
          Task completed
        </div>
      )}

      {task.status === 'IN_PROGRESS' && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-400">
          <Clock3 size={15} />
          Work in progress
        </div>
      )}
    </article>
  );
};

export default TaskCard;

