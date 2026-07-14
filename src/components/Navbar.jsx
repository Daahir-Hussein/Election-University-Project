import { FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-primary-dark/20 bg-primary text-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              EMS
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                Election Management System
              </p>
              <p className="text-xs text-blue-100">National Election Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <FiUser />
            <span>{user?.username}</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
              {user?.role}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
