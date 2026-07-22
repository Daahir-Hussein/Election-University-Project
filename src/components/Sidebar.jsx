import { NavLink } from 'react-router-dom';
import {
  FiAward,
  FiBarChart2,
  FiFlag,
  FiHome,
  FiInfo,
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiLogIn,
} from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/elections', label: 'Elections', icon: FiFlag },
  { to: '/parties', label: 'Political Parties', icon: FiAward },
  { to: '/candidates', label: 'Candidates', icon: FiUserCheck },
  { to: '/voters', label: 'Voters', icon: FiUsers },
  { to: '/vote', label: 'Vote Records', icon: FiCheckCircle },
  { to: '/results', label: 'Election Results', icon: FiBarChart2 },
  { to: '/about', label: 'About', icon: FiInfo },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 transform overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex h-full flex-col p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Main Navigation
          </p>

          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* <p className="mb-3 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Public Access
          </p> */}

          {/* <ul className="space-y-1">
            <li>
              <NavLink
                to="/voter-login"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <FiLogIn size={18} />
                Voter Portal
              </NavLink>
            </li>
          </ul> */}

          <div className="mt-auto rounded-lg bg-surface p-4 text-xs text-gray-600">
            <p className="font-semibold text-primary">Secure Portal</p>
            <p className="mt-1">
              Authorized personnel only. All election data is managed through
              the national API.
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
