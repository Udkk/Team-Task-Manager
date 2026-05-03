const getId = (value) => value?._id || value?.id || value;

const ProjectCard = ({ children, project }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {project.name}
          </h3>
          {project.description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {project.description}
            </p>
          )}
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {project.members?.length || 0} members
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.members?.map((member) => (
          <span
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
            key={getId(member)}
          >
            {member.name || member.email || getId(member)}
          </span>
        ))}
      </div>

      {children}
    </article>
  );
};

export default ProjectCard;
