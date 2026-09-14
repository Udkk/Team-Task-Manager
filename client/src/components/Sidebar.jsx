import { LayoutDashboard, FolderKanban, ListTodo, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Projects',
    to: '/projects',
    icon: FolderKanban
  },
  {
    label: 'Tasks',
    to: '/tasks',
    icon: ListTodo
  }
];

const Sidebar = ({ onLogout, user }) => {
  const navClassName = ({ isActive }) =>
    [
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-cyan-500/10 text-cyan-400'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    ].join(' ');

  return (
    <aside className="border-b border-slate-800 bg-slate-950 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="flex items-start justify-between gap-4 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <ShieldCheck className="text-cyan-400" size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Team Task Manager
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Team workspace
              </p>
            </div>
          </div>

          <span className="mt-4 inline-flex rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400">
            {user?.role || 'MEMBER'}
          </span>
        </div>

        <div className="my-6 border-t border-slate-800" />

        <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink className={navClassName} key={item.to} to={item.to}>
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 hidden border-t border-slate-800 pt-5 lg:block">
          <p className="px-2 text-xs font-medium uppercase tracking-wider text-slate-600">
            Signed in as
          </p>

          <p className="mt-2 truncate px-2 text-sm font-medium text-slate-300">
            {user?.name || 'Workspace'}
          </p>
        </div>

        <button
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 lg:mt-auto"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;