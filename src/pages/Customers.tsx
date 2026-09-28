import React, { useEffect, useState, useCallback } from 'react';
import { FaPhone, FaEnvelope, FaIdCard, FaHistory, FaCalendarAlt, FaBicycle, FaRupeeSign, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from '../components/Modal';
import { getCustomers, PaginationInfo } from '../services/api';
import { Customer } from '../types';

const statusBadgeStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-slate-100 text-slate-800',
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCustomers = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCustomers({ page, limit: 20, search: search || undefined });
      setCustomers(data.customers);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.page);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(1), 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  const openHistory = (customer: Customer) => setSelectedCustomer(customer);
  const closeHistory = () => setSelectedCustomer(null);

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && customers.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Customers</h3>
          <input
            type="text"
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">ID Proof</th>
              <th className="px-6 py-3 font-medium">Bookings</th>
              <th className="px-6 py-3 font-medium">Total Spent</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-slate-600">
                      <p className="flex items-center gap-2"><FaPhone className="text-xs" /> {customer.phone}</p>
                      <p className="flex items-center gap-2"><FaEnvelope className="text-xs" /> {customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-slate-600">
                      <FaIdCard className="text-xs" /> {customer.idProof}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-turquoise-blue/10 text-turquoise-blue rounded-full text-xs font-medium">
                      {customer.totalBookings} bookings
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    ₹{customer.totalSpent || 0}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openHistory(customer)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      <FaHistory />
                      View History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCustomers(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchCustomers(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="p-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedCustomer}
        onClose={closeHistory}
        title={selectedCustomer ? `Booking History - ${selectedCustomer.name}` : 'Booking History'}
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <FaPhone className="text-turquoise-blue" /> {selectedCustomer.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FaEnvelope className="text-turquoise-blue" /> {selectedCustomer.email}
              </div>
            </div>

            <div className="space-y-3">
              {selectedCustomer.history.length === 0 ? (
                <p className="text-sm text-slate-500">No booking history found.</p>
              ) : (
                selectedCustomer.history.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <FaBicycle className="text-turquoise-blue" />
                        {booking.bikeName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FaCalendarAlt />
                        {booking.startDate} → {booking.endDate}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                        <FaRupeeSign />
                        {booking.amount}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                          statusBadgeStyles[booking.status] || statusBadgeStyles.pending
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
