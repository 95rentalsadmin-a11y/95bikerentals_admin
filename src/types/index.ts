export interface Bike {
  id: string;
  name: string;
  image: string;
  features: string[];
  baseRatePerHour: number;
  baseRate12Hours: number;
  baseRate24Hours: number;
  category: string;
  available: boolean;
  // Package pricing
  price1Day?: number;
  price2Days?: number;
  price3Days?: number;
  price7Days?: number;
  // Maintenance tracking
  odometer?: number;
  lastServiceDate?: string | null;
  nextServiceDue?: string | null;
  maintenanceNote?: string;
  status?: 'active' | 'maintenance' | 'retired';
}

export interface Booking {
  id: string;
  bikeId: string;
  bikeName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  idProof: string;
  idProofFilePath?: string | null;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  calculatedRate: number;
  durationHours: number;
  securityDeposit: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cash' | 'whatsapp';
  paymentMethod?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  refundStatus?: 'none' | 'pending' | 'processed' | 'not_eligible' | 'failed';
  refundAmount?: number;
  razorpayRefundId?: string | null;
  refundedAt?: string | null;
  lateReturnCharge?: number;
  lateFeeStatus?: 'none' | 'due' | 'settled';
  depositStatus?: 'held' | 'refunded' | 'applied';
  depositRefundAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalBikes: number;
  availableBikes: number;
  totalRevenue: number;
  pendingBookings: number;
  pendingPayments: number;
  paidBookings: number;
  recentActivity: {
    id: string;
    status: string;
    paymentStatus: string;
    updatedAt: string;
    customerName: string;
    bike: { name: string };
  }[];
}

export interface CustomerHistory {
  id: string;
  bikeName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  idProof: string;
  totalBookings: number;
  totalSpent?: number;
  lastBooking: string;
  history: CustomerHistory[];
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'superadmin';
}
