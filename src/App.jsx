import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import FrontOffice from './pages/FrontOffice';
import Housekeeping from './pages/Housekeeping';
import Billing from './pages/Billing';
import Guests from './pages/Guests';
import Automation from './pages/Automation';
import Analytics from './pages/Analytics';

import Login from './pages/Login';
import Signup from './pages/auth/Signup';
import HotelManagement from './pages/super-admin/HotelManagement';
import Subscriptions from './pages/super-admin/Subscriptions';
import PlatformUsers from './pages/super-admin/PlatformUsers';
import SuperAdminSettings from './pages/super-admin/SuperAdminSettings';
import HotelSettings from './pages/HotelSettings';
import Unauthorized from './pages/Unauthorized';
import { ROLES } from './context/AppContext';

const HOTEL_STAFF_ROLES = [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.HOUSEKEEPING, ROLES.MANAGER, ROLES.STAFF];
const ADMIN_ONLY = [ROLES.SUPER_ADMIN];

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            
            {/* Super Admin Routes */}
            <Route path="hotels" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><HotelManagement /></ProtectedRoute>} />
            <Route path="subscriptions" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><Subscriptions /></ProtectedRoute>} />
            <Route path="platform-users" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><PlatformUsers /></ProtectedRoute>} />
            <Route path="system-settings" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><SuperAdminSettings /></ProtectedRoute>} />
            
            {/* Hotel Admin/Staff Routes */}
            <Route path="reservations" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.MANAGER]}><Reservations /></ProtectedRoute>} />
            <Route path="front-office" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK]}><FrontOffice /></ProtectedRoute>} />
            <Route path="housekeeping" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.HOUSEKEEPING]}><Housekeeping /></ProtectedRoute>} />
            <Route path="billing" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN]}><Billing /></ProtectedRoute>} />
            <Route path="guests" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK]}><Guests /></ProtectedRoute>} />
            <Route path="automation" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN]}><Automation /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.SUPER_ADMIN]}><Analytics /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={[ROLES.HOTEL_ADMIN]}><HotelSettings /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
