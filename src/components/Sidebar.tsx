import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaClipboardList, FaBicycle, FaUsers, FaSignOutAlt, FaTags, FaPlus } from 'react-icons/fa';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { to: '/', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/bookings', icon: FaClipboardList, label: 'Bookings' },
    { to: '/bikes', icon: FaBicycle, label: 'Bikes' },
    { to: '/accessories', icon: FaPlus, label: 'Accessories' },
    { to: '/coupons', icon: FaTags, label: 'Coupons' },
    { to: '/customers', icon: FaUsers, label: 'Customers' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide">95 Bike Rentals</h1>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? 'bg-turquoise-blue text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
