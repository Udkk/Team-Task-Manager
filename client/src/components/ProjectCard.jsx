
import {
  FolderKanban,
  Users,
  UserRound,
  ShieldCheck
} from 'lucide-react';

const getId = (value) => value?._id || value?.id || value;

const getInitial = (name) => {
  if (!name) {
    return '?';
  }

  return name.charAt(0).toUpperCase();
};

const ProjectCard = ({ children, project }) => {
  const memberCount = project.members?.length || 0;

  return (
    <article className="rounded-2xl bg-slate-900 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <FolderKanban size={17} />
            </div>

            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Project
            </span>
          </div>

          <h3 className="truncate text-xl font-semibold text-white">
            {project.name}
          </h3>

          {project.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
              {project.description}
            </p>
          )}
        </div>

        {/* Member count */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
          <Users size={15} className="text-cyan-400" />

          <span className="text-sm font-semibold text-slate-300">
            {memberCount}
          </span>

          <span className="hidden text-xs text-slate-500 sm:inline">
            {memberCount === 1 ? 'member' : 'members'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-slate-800" />

      {/* Members */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserRound size={15} className="text-slate-500" />

            <span className="text-xs font-medium text-slate-500">
              Team members
            </span>
          </div>

          {memberCount > 0 && (
            <span className="text-xs text-slate-600">
              {memberCount} {memberCount === 1 ? 'person' : 'people'}
            </span>
          )}
        </div>

        {memberCount > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.members.map((member) => {
              const memberName =
                member.name || member.email || getId(member);

              return (
                <div
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-2.5 py-2"
                  key={getId(member)}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400">
                    {getInitial(member.name || member.email)}
                  </div>

                  <span className="max-w-32 truncate text-xs font-medium text-slate-300">
                    {memberName}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-4 py-4 text-center">
            <p className="text-xs text-slate-600">
              No team members added yet
            </p>
          </div>
        )}
      </div>

      {/* Project owner */}
      {project.createdBy && (
        <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-4">
          <ShieldCheck size={15} className="text-emerald-400" />

          <span className="text-xs text-slate-500">
            Created by
          </span>

          <span className="truncate text-xs font-medium text-slate-300">
            {project.createdBy?.name ||
              project.createdBy?.email ||
              getId(project.createdBy)}
          </span>
        </div>
      )}

      {/* Actions / children */}
      {children}
    </article>
  );
};

export default ProjectCard;
