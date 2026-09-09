import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' }
];

const Sidebar = ({ onLogout, user }) => {
  const navClassName = ({ isActive }) =>
    [
      'block rounded-md px-3 py-2 text-sm font-medium',
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
    ].join(' ');

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="flex items-center justify-between gap-4 lg:block">
          <div>
            <p className="text-sm font-semibold text-blue-600">Task Manager</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              {user?.name || 'Workspace'}
            </h1>
          </div>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 lg:mt-4 lg:inline-block">
            {user?.role || 'MEMBER'}
          </span>
        </div>

        <nav className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {navItems.map((item) => (
            <NavLink className={navClassName} key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="mt-5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 lg:mt-auto"
          type="button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
