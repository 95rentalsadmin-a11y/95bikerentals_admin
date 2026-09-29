import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Bikes from './pages/Bikes';
import Accessories from './pages/Accessories';
import Coupons from './pages/Coupons';
import Customers from './pages/Customers';
import NotFound from './pages/NotFound';
import DepositSettings from './pages/DepositSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bikes" element={<Bikes />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="customers" element={<Customers />} />
          <Route path="deposit-settings" element={<DepositSettings />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
