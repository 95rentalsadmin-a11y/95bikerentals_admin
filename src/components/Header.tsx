import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaMoon, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Modal from './Modal';

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/bookings': 'Bookings',
  '/bikes': 'Bikes',
  '/customers': 'Customers',
};

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = titleMap[location.pathname] || 'Admin';

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'profile' | 'settings' | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'New booking #B-1024 received', time: '2 min ago', read: false },
    { id: '2', message: 'Bike Aether 450X is now unavailable', time: '1 hour ago', read: false },
    { id: '3', message: 'Customer Rahul Sharma updated profile', time: '3 hours ago', read: true },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-turquoise-blue transition-colors"
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-hot-pink rounded-full" />
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="text-xs text-slate-500">{unreadCount} unread</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-500 text-center">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                        notification.read ? 'opacity-70' : 'bg-turquoise-blue/5'
                      }`}
                    >
                      <p className="text-sm text-slate-700">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
          >
            <FaUserCircle className="text-2xl text-slate-400" />
            <span className="font-medium">Admin</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">admin@95bikerentals.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveModal('profile');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaUser className="text-slate-400" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveModal('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaCog className="text-slate-400" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-hot-pink hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        title="Admin Profile"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-turquoise-blue rounded-full flex items-center justify-center text-white text-3xl mb-3">
            <FaUser />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Admin User</h3>
          <p className="text-sm text-slate-500">Super Admin</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <FaEnvelope className="text-turquoise-blue" />
            <div className="text-left">
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-800">admin@95bikerentals.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <FaPhone className="text-turquoise-blue" />
            <div className="text-left">
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium text-slate-800">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <FaShieldAlt className="text-turquoise-blue" />
            <div className="text-left">
              <p className="text-xs text-slate-500">Role</p>
              <p className="text-sm font-medium text-slate-800">Full access</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveModal(null)}
          className="w-full mt-5 py-2 bg-turquoise-blue hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="Settings"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FaMoon className="text-turquoise-blue" />
              <div>
                <p className="text-sm font-medium text-slate-800">Dark Mode</p>
                <p className="text-xs text-slate-500">Coming soon</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`text-2xl transition-colors ${darkMode ? 'text-turquoise-blue' : 'text-slate-300'}`}
            >
              {darkMode ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FaBell className="text-turquoise-blue" />
              <div>
                <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive booking alerts</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications((prev) => !prev)}
              className={`text-2xl transition-colors ${emailNotifications ? 'text-turquoise-blue' : 'text-slate-300'}`}
            >
              {emailNotifications ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
        </div>
        <button
          onClick={() => setActiveModal(null)}
          className="w-full mt-5 py-2 bg-turquoise-blue hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </Modal>
    </header>
  );
};

export default Header;
