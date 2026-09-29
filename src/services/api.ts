import { Bike, Booking, Customer, DashboardStats } from '../types';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const loginAdmin = (username: string, password: string) =>
  request<{ token: string; user: { id: string; username: string; role: string } }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const getDashboardStats = () => request<DashboardStats>('/admin/dashboard');

export const getSecurityDeposit = () => request<{ securityDeposit: number }>('/admin/settings/security-deposit');

export const updateSecurityDeposit = (securityDeposit: number) =>
  request<{ securityDeposit: number }>('/admin/settings/security-deposit', {
    method: 'PATCH',
    body: JSON.stringify({ securityDeposit }),
  });

export interface PaginatedBookings {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedCustomers {
  customers: Customer[];
  pagination: PaginationInfo;
}

export const getAllBookings = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.paymentStatus && params.paymentStatus !== 'all') query.set('paymentStatus', params.paymentStatus);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  const qs = query.toString();
  return request<PaginatedBookings>(`/admin/bookings${qs ? `?${qs}` : ''}`);
};

export const exportBookingsCsv = async (params?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Blob> => {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.paymentStatus && params.paymentStatus !== 'all') query.set('paymentStatus', params.paymentStatus);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  const qs = query.toString();
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_URL}/admin/bookings/export/csv${qs ? `?${qs}` : ''}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Failed to export bookings');
  return res.blob();
};

export const downloadBookingIdProof = async (id: string): Promise<Blob> => {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_URL}/admin/bookings/${id}/id-proof`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Failed to download ID proof');
  return res.blob();
};
export const getAllBikes = () => request<Bike[]>('/admin/bikes');
export const getCustomers = (params?: { page?: number; limit?: number; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return request<PaginatedCustomers>(`/admin/customers${qs ? `?${qs}` : ''}`);
};

export const uploadBikeImage = (file: File) => {
  const token = localStorage.getItem('adminToken');
  const formData = new FormData();
  formData.append('image', file);

  return fetch(`${API_URL}/admin/bikes/upload-image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `Upload failed: ${res.status}`);
    }
    return res.json() as Promise<{ url: string }>;
  });
};

export const createBike = (bike: Omit<Bike, 'id'>) =>
  request<Bike>('/admin/bikes', {
    method: 'POST',
    body: JSON.stringify(bike),
  });
export const updateBike = (id: string, bike: Bike) =>
  request<Bike>(`/admin/bikes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(bike),
  });
export const updateBikeAvailability = (id: string, available: boolean) =>
  request<Bike>(`/admin/bikes/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ available }),
  });
export const updateBookingStatus = (id: string, status: string) =>
  request<Booking>(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const updateBookingDeposit = (id: string, securityDeposit: number) =>
  request<Booking>(`/admin/bookings/${id}/deposit`, {
    method: 'PATCH',
    body: JSON.stringify({ securityDeposit }),
  });

export const returnBike = (id: string, actualReturnDate: string, actualReturnTime: string) =>
  request<{ message: string; booking: Booking; lateReturnCharge: number; lateHours: number }>(`/admin/bookings/${id}/return`, {
    method: 'POST',
    body: JSON.stringify({ actualReturnDate, actualReturnTime }),
  });

// Accessories
export interface Accessory {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  available: boolean;
}

export const getAllAccessories = () => request<Accessory[]>('/admin/accessories');
export const createAccessory = (data: Omit<Accessory, 'id'>) =>
  request<Accessory>('/admin/accessories', { method: 'POST', body: JSON.stringify(data) });
export const updateAccessory = (id: string, data: Partial<Accessory>) =>
  request<Accessory>(`/admin/accessories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteAccessory = (id: string) =>
  request<{ message: string }>(`/admin/accessories/${id}`, { method: 'DELETE' });

// Coupons
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usesCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export const getAllCoupons = () => request<Coupon[]>('/admin/coupons');
export const createCoupon = (data: Omit<Coupon, 'id' | 'usesCount'>) =>
  request<Coupon>('/admin/coupons', { method: 'POST', body: JSON.stringify(data) });
export const updateCoupon = (id: string, data: Partial<Coupon>) =>
  request<Coupon>(`/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteCoupon = (id: string) =>
  request<{ message: string }>(`/admin/coupons/${id}`, { method: 'DELETE' });
