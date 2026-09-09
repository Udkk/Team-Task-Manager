import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AppLayout = () => {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar onLogout={logout} user={user} />

      <section className="min-w-0 flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AppLayout;
