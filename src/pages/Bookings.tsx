import React, { useEffect, useState, useCallback } from 'react';
import { FaEye, FaCheck, FaTimes, FaClock, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaRupeeSign, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from '../components/Modal';
import { getAllBookings, updateBookingStatus, updateBookingDeposit, downloadBookingIdProof, exportBookingsCsv, PaginationInfo } from '../services/api';
import { Booking } from '../types';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-slate-100 text-slate-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const paymentBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    paid: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-700',
    refunded: 'bg-purple-50 text-purple-700',
    cash: 'bg-blue-50 text-blue-700',
    whatsapp: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [depositDraft, setDepositDraft] = useState('');
  const [savingDeposit, setSavingDeposit] = useState(false);

  const fetchBookings = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllBookings({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter,
        paymentStatus: paymentFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setBookings(data.bookings);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.page);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, paymentFilter, startDate, endDate]);

  useEffect(() => {
    const t = setTimeout(() => fetchBookings(1), 300);
    return () => clearTimeout(t);
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setDepositDraft(String(booking.securityDeposit || 0));
  };
  const closeModal = () => setSelectedBooking(null);
  const saveDeposit = async () => {
    if (!selectedBooking) return;
    const securityDeposit = Number(depositDraft);
    if (!Number.isInteger(securityDeposit) || securityDeposit < 0) {
      alert('Deposit must be a non-negative whole number');
      return;
    }

    setSavingDeposit(true);
    try {
      const booking = await updateBookingDeposit(selectedBooking.id, securityDeposit);
      setBookings((prev) => prev.map((item) => (item.id === booking.id ? booking : item)));
      setSelectedBooking(booking);
      setDepositDraft(String(booking.securityDeposit));
    } catch (err: any) {
      alert(err.message || 'Failed to update deposit');
    } finally {
      setSavingDeposit(false);
    }
  };
  const openIdProof = async (id: string) => {
    try {
      const blob = await downloadBookingIdProof(id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err: any) {
      alert(err.message || 'Failed to download ID proof');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportBookingsCsv({
        search: search || undefined,
        status: statusFilter,
        paymentStatus: paymentFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setStartDate('');
    setEndDate('');
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800">All Bookings</h3>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-turquoise-blue text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <FaDownload />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name, phone, email, or booking ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
          >
            <option value="all">All Payments</option>
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="cash">Cash</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
            title="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
            title="End date"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Booking ID</th>
              <th className="px-6 py-3 font-medium">Bike</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{booking.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-slate-600">{booking.bikeName}</td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800 font-medium">{booking.customerName}</p>
                    <p className="text-xs text-slate-500">{booking.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-xs text-slate-400" />
                      {booking.durationHours}h
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">₹{booking.calculatedRate}</td>
                  <td className="px-6 py-4">{statusBadge(booking.status)}</td>
                  <td className="px-6 py-4">{paymentBadge(booking.paymentStatus)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="p-2 text-slate-500 hover:text-turquoise-blue transition-colors"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        disabled={booking.status === 'confirmed' || booking.status === 'cancelled' || booking.status === 'completed'}
                        className="p-2 text-slate-500 hover:text-mint-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Confirm"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                        className="p-2 text-slate-500 hover:text-hot-pink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
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
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchBookings(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchBookings(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="p-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedBooking}
        onClose={closeModal}
        title={selectedBooking ? `Booking ${selectedBooking.id.slice(0, 8)}...` : 'Booking Details'}
      >
        {selectedBooking && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bike</p>
                <p className="text-lg font-semibold text-slate-800">{selectedBooking.bikeName}</p>
              </div>
              {statusBadge(selectedBooking.status)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FaUser className="mt-1 text-turquoise-blue" />
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBooking.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FaPhone className="mt-1 text-turquoise-blue" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBooking.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FaEnvelope className="mt-1 text-turquoise-blue" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBooking.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FaIdCard className="mt-1 text-turquoise-blue" />
                <div>
                  <p className="text-xs text-slate-500">ID Proof</p>
                  <p className="text-sm font-medium text-slate-800">{selectedBooking.idProof}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <FaMapMarkerAlt className="mt-1 text-turquoise-blue" />
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm font-medium text-slate-800">{selectedBooking.customerAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <FaCalendarAlt className="mt-1 text-turquoise-blue" />
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm font-medium text-slate-800">
                  {selectedBooking.startDate} {selectedBooking.startTime} → {selectedBooking.endDate} {selectedBooking.endTime}
                  <span className="ml-2 text-xs text-slate-500">({selectedBooking.durationHours} hours)</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <FaRupeeSign className="mt-1 text-turquoise-blue" />
              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="text-lg font-semibold text-slate-800">₹{selectedBooking.calculatedRate}
                  <span className="ml-2 text-xs text-slate-500">+ ₹{selectedBooking.securityDeposit || 0} deposit</span>
                </p>
              </div>
            </div>

            <div className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg">
              <label className="flex-1">
                <span className="text-xs text-slate-500">Security Deposit (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={depositDraft}
                  onChange={(e) => setDepositDraft(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
                />
              </label>
              <button
                type="button"
                onClick={saveDeposit}
                disabled={savingDeposit}
                className="px-4 py-2 bg-turquoise-blue text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {savingDeposit ? 'Saving...' : 'Save Deposit'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500">Payment Status</p>
                <div className="mt-1">{paymentBadge(selectedBooking.paymentStatus)}</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Method</p>
                <p className="text-sm font-medium text-slate-800 capitalize">{selectedBooking.paymentMethod || '—'}</p>
              </div>
            </div>

            {selectedBooking.idProofFilePath && (
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <FaIdCard className="mt-1 text-turquoise-blue" />
                <div>
                  <p className="text-xs text-slate-500">ID Proof Document</p>
                  <button
                    type="button"
                    onClick={() => openIdProof(selectedBooking.id)}
                    className="text-sm font-medium text-turquoise-blue hover:underline"
                  >
                    View uploaded document
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  updateStatus(selectedBooking.id, 'confirmed');
                  closeModal();
                }}
                disabled={selectedBooking.status === 'confirmed' || selectedBooking.status === 'cancelled' || selectedBooking.status === 'completed'}
                className="flex-1 py-2 bg-mint-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  updateStatus(selectedBooking.id, 'cancelled');
                  closeModal();
                }}
                disabled={selectedBooking.status === 'cancelled' || selectedBooking.status === 'completed'}
                className="flex-1 py-2 bg-hot-pink hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
