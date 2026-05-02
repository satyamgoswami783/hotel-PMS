import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

import { useApp } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import FrontOffice from './pages/FrontOffice';
import Housekeeping from './pages/Housekeeping';
import Billing from './pages/Billing';
import Guests from './pages/Guests';
import Automation from './pages/Automation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import HotelManagement from './pages/super-admin/HotelManagement';
import Subscriptions from './pages/super-admin/Subscriptions';
import PlatformUsers from './pages/super-admin/PlatformUsers';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="hotels" element={<HotelManagement />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="platform-users" element={<PlatformUsers />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="front-office" element={<FrontOffice />} />
            <Route path="housekeeping" element={<Housekeeping />} />
            <Route path="billing" element={<Billing />} />
            <Route path="guests" element={<Guests />} />
            <Route path="automation" element={<Automation />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
