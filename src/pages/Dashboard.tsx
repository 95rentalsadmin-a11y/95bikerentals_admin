import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBicycle, FaDollarSign, FaUserCheck, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import { exportBookingsCsv, getDashboardStats } from '../services/api';
import { DashboardStats } from '../types';

const defaultStats: DashboardStats = {
  totalBookings: 0,
  activeBookings: 0,
  totalBikes: 0,
  availableBikes: 0,
  totalRevenue: 0,
  pendingBookings: 0,
  pendingPayments: 0,
  paidBookings: 0,
  recentActivity: [],
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const generateReport = async () => {
    try {
      const blob = await exportBookingsCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={FaClipboardList} colorClass="bg-turquoise-blue" />
        <StatCard title="Active Rentals" value={stats.activeBookings} icon={FaUserCheck} colorClass="bg-mint-green" />
        <StatCard title="Available Bikes" value={`${stats.availableBikes}/${stats.totalBikes}`} icon={FaBicycle} colorClass="bg-orange" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={FaDollarSign} colorClass="bg-hot-pink" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={FaClipboardList} colorClass="bg-yellow-400" />
        <StatCard title="Paid Bookings" value={stats.paidBookings} icon={FaCheckCircle} colorClass="bg-mint-green" />
        <StatCard title="Pending Payments" value={stats.pendingPayments} icon={FaCreditCard} colorClass="bg-hot-pink" />
        <StatCard title="Active Rentals" value={stats.activeBookings} icon={FaUserCheck} colorClass="bg-turquoise-blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No booking activity yet.</p>
            ) : stats.recentActivity.map((item) => (
              <div key={`${item.id}-${item.updatedAt}`} className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-turquoise-blue" />
                <div>
                  <p className="text-sm text-slate-700">
                    {item.bike.name} booking for {item.customerName} is {item.status}.
                  </p>
                  <p className="text-xs text-slate-400">{new Date(item.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/bikes')}
              className="p-4 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-turquoise-blue hover:text-white rounded-lg transition-colors text-left"
            >
              Add New Bike
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="p-4 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-turquoise-blue hover:text-white rounded-lg transition-colors text-left"
            >
              View Pending Bookings
            </button>
            <button
              onClick={generateReport}
              className="p-4 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-turquoise-blue hover:text-white rounded-lg transition-colors text-left"
            >
              Generate Report
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="p-4 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-turquoise-blue hover:text-white rounded-lg transition-colors text-left"
            >
              Manage Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
