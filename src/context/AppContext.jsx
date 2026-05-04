import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  HOTEL_ADMIN: 'Hotel Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  FRONT_DESK: 'Front Desk',
  HOUSEKEEPING: 'Housekeeping'
};

export const AppProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [role, setRoleState] = useState(ROLES.HOTEL_ADMIN);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(true);

  // Persistence Logic
  useEffect(() => {
    const savedUser = localStorage.getItem('stayflow_user');
    const savedRole = localStorage.getItem('stayflow_role');
    const savedAuth = localStorage.getItem('stayflow_auth');

    if (savedAuth === 'true' && savedUser) {
      setUser(JSON.parse(savedUser));
      setRoleState(savedRole);
      setIsAuthenticatedState(true);
    }
    setIsInitializing(false);
  }, []);

  const setIsAuthenticated = (value, userData = null) => {
    if (value && userData) {
      localStorage.setItem('stayflow_auth', 'true');
      localStorage.setItem('stayflow_user', JSON.stringify(userData));
      localStorage.setItem('stayflow_role', userData.role);
      setUser(userData);
      setRoleState(userData.role);
      setIsAuthenticatedState(true);
    } else {
      localStorage.removeItem('stayflow_auth');
      localStorage.removeItem('stayflow_user');
      localStorage.removeItem('stayflow_role');
      setUser(null);
      setIsAuthenticatedState(false);
    }
  };

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem('stayflow_role', newRole);
  };
  
  const [toasts, setToasts] = useState([]);
  const [automationLogs, setAutomationLogs] = useState([
    { id: 1, action: 'AI Optimized', details: 'Room rates adjusted for high demand weekend', time: '2 mins ago' },
    { id: 2, action: 'Auto-Checkin', details: 'Guest John Doe pre-checked via Mobile App', time: '15 mins ago' },
    { id: 3, action: 'Energy Save', details: 'HVAC reduced in vacant wing B', time: '1 hour ago' },
  ]);

  const [featureToggles, setFeatureToggles] = useState({
    assignment: true,
    housekeeping: true,
    billing: true,
    alerts: true,
  });

  const [rooms, setRooms] = useState([
    { id: '101', type: 'Deluxe', status: 'vacant', cleaning: 'clean', guest: null, assignedStaff: null, lastCleaned: '10:00 AM' },
    { id: '102', type: 'Deluxe', status: 'occupied', cleaning: 'clean', guest: 'John Doe', assignedStaff: null, lastCleaned: 'Yesterday' },
    { id: '103', type: 'Suite', status: 'vacant', cleaning: 'dirty', guest: null, assignedStaff: null, lastCleaned: '09:30 AM' },
    { id: '104', type: 'Standard', status: 'occupied', cleaning: 'clean', guest: 'Krhjh', assignedStaff: null, lastCleaned: '11:00 AM' },
    { id: '201', type: 'Standard', status: 'vacant', cleaning: 'clean', guest: null, assignedStaff: null, lastCleaned: '08:15 AM' },
    { id: '202', type: 'Standard', status: 'vacant', cleaning: 'clean', guest: null, assignedStaff: null, lastCleaned: '08:45 AM' },
    { id: '203', type: 'Deluxe', status: 'occupied', cleaning: 'clean', guest: 'Robert Brown', assignedStaff: null, lastCleaned: '09:00 AM' },
    { id: '204', type: 'Suite', status: 'occupied', cleaning: 'clean', guest: 'William Taylor', assignedStaff: null, lastCleaned: '09:20 AM' },
  ]);

  const [bookings, setBookings] = useState([
    { id: 'BK-1001', guestName: 'John Doe', room: '102', checkIn: '2026-05-01', checkOut: '2026-05-05', status: 'IN_HOUSE', amount: 800, paymentStatus: 'paid', source: 'Booking.com' },
    { id: 'BK-1002', guestName: 'Jane Smith', room: '103', checkIn: '2026-05-03', checkOut: '2026-05-06', status: 'confirmed', amount: 450, paymentStatus: 'pending', source: 'Direct' },
    { id: 'BK-1003', guestName: 'Emma Watson', room: '101', checkIn: '2026-05-02', checkOut: '2026-05-04', status: 'confirmed', amount: 400, paymentStatus: 'paid', source: 'Expedia' },
    { id: 'BK-1004', guestName: 'Robert Brown', room: '203', checkIn: '2026-05-06', checkOut: '2026-05-08', status: 'IN_HOUSE', amount: 1200, paymentStatus: 'paid', source: 'Airbnb' },
    { id: 'BK-1005', guestName: 'William Taylor', room: '204', checkIn: '2026-05-07', checkOut: '2026-05-10', status: 'confirmed', amount: 1500, paymentStatus: 'pending', source: 'Direct' },
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: 'Mike Ross', role: 'Housekeeping', status: 'Available', tasks: 0 },
    { id: 2, name: 'Harvey Specter', role: 'Manager', status: 'On Break', tasks: 1 },
    { id: 3, name: 'Rachel Zane', role: 'Front Desk', status: 'Busy', tasks: 3 },
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'INV-001', guestName: 'John Doe', amount: 800, status: 'Paid', date: '2026-05-01' },
    { id: 'INV-002', guestName: 'Sarah Connor', amount: 1200, status: 'Unpaid', date: '2026-05-02' },
  ]);

  const [hotels, setHotels] = useState([
    { id: 1, name: 'Grand AutoPilot Resort', location: 'New York, USA', rooms: 150, plan: 'Enterprise', status: 'Active' },
    { id: 2, name: 'Azure Bay Hotel', location: 'Miami, USA', rooms: 75, plan: 'Standard', status: 'Active' },
    { id: 3, name: 'Urban Peak Suites', location: 'London, UK', rooms: 25, plan: 'Trial', status: 'Pending' },
  ]);

  const [systemEvents, setSystemEvents] = useState([
    { id: 1, type: 'check-in', message: 'John Doe checked in to Room 102', time: '10:30 AM' },
    { id: 2, type: 'cleaning', message: 'Room 103 marked as Dirty', time: '11:15 AM' },
    { id: 3, type: 'booking', message: 'New booking confirmed for Jane Smith', time: '12:00 PM' },
  ]);

  const [rolePermissions, setRolePermissions] = useState({
    [ROLES.SUPER_ADMIN]: {
      'Dashboard': { view: true, create: true, edit: true, delete: true },
      'Reservations': { view: true, create: true, edit: true, delete: true },
      'Front Office': { view: true, create: true, edit: true, delete: true },
      'Housekeeping': { view: true, create: true, edit: true, delete: true },
      'Billing & Invoices': { view: true, create: true, edit: true, delete: true },
      'Guest Experience': { view: true, create: true, edit: true, delete: true },
      'Automation Center': { view: true, create: true, edit: true, delete: true },
      'Analytics & Reports': { view: true, create: true, edit: true, delete: true },
      'Settings': { view: true, create: true, edit: true, delete: true },
      'Hotels Management': { view: true, create: true, edit: true, delete: true },
      'Subscriptions': { view: true, create: true, edit: true, delete: true },
      'Platform Users': { view: true, create: true, edit: true, delete: true },
    },
    [ROLES.HOTEL_ADMIN]: {
      'Dashboard': { view: true, create: true, edit: true, delete: true },
      'Reservations': { view: true, create: true, edit: true, delete: true },
      'Front Office': { view: true, create: true, edit: true, delete: true },
      'Housekeeping': { view: true, create: true, edit: true, delete: true },
      'Billing & Invoices': { view: true, create: true, edit: true, delete: true },
      'Guest Experience': { view: true, create: true, edit: true, delete: true },
      'Automation Center': { view: true, create: true, edit: true, delete: true },
      'Analytics & Reports': { view: true, create: true, edit: true, delete: true },
      'Settings': { view: true, create: true, edit: true, delete: true },
    },
    'Manager': {
      'Dashboard': { view: true, create: true, edit: true, delete: false },
      'Reservations': { view: true, create: true, edit: true, delete: false },
      'Front Office': { view: true, create: true, edit: true, delete: false },
      'Housekeeping': { view: true, create: true, edit: true, delete: false },
      'Billing & Invoices': { view: true, create: true, edit: true, delete: false },
      'Guest Experience': { view: true, create: true, edit: true, delete: false },
      'Automation Center': { view: false, create: false, edit: false, delete: false },
      'Analytics & Reports': { view: true, create: false, edit: false, delete: false },
      'Settings': { view: false, create: false, edit: false, delete: false },
    },
    'Staff': {
      'Dashboard': { view: true, create: false, edit: false, delete: false },
      'Reservations': { view: true, create: true, edit: true, delete: false },
      'Front Office': { view: true, create: true, edit: true, delete: false },
      'Housekeeping': { view: true, create: true, edit: true, delete: false },
      'Billing & Invoices': { view: false, create: false, edit: false, delete: false },
      'Guest Experience': { view: true, create: false, edit: false, delete: false },
      'Automation Center': { view: false, create: false, edit: false, delete: false },
      'Analytics & Reports': { view: false, create: false, edit: false, delete: false },
      'Settings': { view: false, create: false, edit: false, delete: false },
    },
  });

  const updateRolePermissions = (roleName, updates) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleName]: updates
    }));
    addToast(`Permissions for ${roleName} updated successfully!`);
  };

  const [platformUsers, setPlatformUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@grandresort.com', role: 'Hotel Admin', property: 'Grand AutoPilot Resort', status: 'Active', joined: '2026-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@azurebay.com', role: 'Hotel Admin', property: 'Azure Bay Hotel', status: 'Active', joined: '2026-02-10' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@urbanpeak.com', role: 'Hotel Admin', property: 'Urban Peak Suites', status: 'Pending', joined: '2026-05-01' },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 'REQ-101', hotelName: 'Grand AutoPilot Resort', email: 'admin@grandresort.com', plan: 'Enterprise', status: 'Pending' },
    { id: 'REQ-102', hotelName: 'Azure Bay Hotel', email: 'manager@azurebay.com', plan: 'Standard', status: 'Pending' },
    { id: 'REQ-103', hotelName: 'Urban Peak Suites', email: 'owner@urbanpeak.com', plan: 'Trial', status: 'Pending' },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Basic', price: 99, features: ['50 Rooms', 'Standard Support', 'Basic Analytics'], duration: 'Monthly' },
    { id: 2, name: 'Pro', price: 299, features: ['200 Rooms', 'Priority Support', 'Advanced Analytics'], duration: 'Monthly' },
    { id: 3, name: 'Enterprise', price: 999, features: ['Unlimited Rooms', '24/7 Dedicated Support', 'Full AI Automation'], duration: 'Yearly' },
  ]);

  const [platformSettings, setPlatformSettings] = useState({
    name: 'AutoPilot SaaS',
    currency: 'USD',
    timezone: 'UTC+0',
    notificationsEnabled: true
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Booking', message: 'Emma Watson booked Room 101', time: '5m ago', read: false, type: 'info' },
    { id: 2, title: 'Housekeeping Alert', message: 'Room 103 needs cleaning', time: '20m ago', read: false, type: 'warning' },
    { id: 3, title: 'System Update', message: 'AutoPilot core updated to v2.4', time: '1h ago', read: true, type: 'success' },
  ]);

  const [guests, setGuests] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', status: 'VIP', spent: 1500, visits: 4 },
    { id: 2, name: 'Emma Watson', email: 'emma@example.com', phone: '+1 987 654 321', status: 'Regular', spent: 400, visits: 1 },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555 010 999', status: 'Regular', spent: 450, visits: 2 },
    { id: 4, name: 'Robert Brown', email: 'robert@example.com', phone: '+1 444 222 333', status: 'VIP', spent: 1200, visits: 3 },
  ]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addSystemEvent = (message, type = 'info') => {
    const newEvent = {
      id: Date.now() + Math.random(),
      type,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSystemEvents(prev => [newEvent, ...prev]);
  };

  const addAutomationLog = (action, details) => {
    const newLog = {
      id: Date.now() + Math.random(),
      action,
      details,
      time: 'Just now'
    };
    setAutomationLogs(prev => [newLog, ...prev]);
  };

  const updateRoomStatus = (roomId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updates } : room));
    if (updates.status) addSystemEvent(`Room ${roomId} status changed to ${updates.status}`);
  };

  const addBooking = (newBooking) => {
    const id = `BK-${Math.floor(Math.random() * 9000) + 1000}`;
    let assignedRoom = newBooking.room;

    const booking = { id, status: 'confirmed', paymentStatus: 'pending', ...newBooking, room: assignedRoom };
    setBookings(prev => [...prev, booking]);
    
    if (assignedRoom) {
      updateRoomStatus(assignedRoom, { status: 'occupied', guest: newBooking.guestName });
    }
    
    addToast('New booking added successfully!');
    addSystemEvent(`New booking ${id} for ${newBooking.guestName}`);
    return true;
  };

  const updateBooking = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addToast('Booking updated successfully!');
    return true;
  };

  const deleteBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking && booking.room) {
      updateRoomStatus(booking.room, { status: 'vacant', guest: null });
    }
    setBookings(prev => prev.filter(b => b.id !== id));
    addToast('Booking deleted');
  };

  const checkInGuest = (bookingId, roomId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      updateBooking(bookingId, { status: 'IN_HOUSE', room: roomId || booking.room });
      updateRoomStatus(roomId || booking.room, { status: 'occupied', guest: booking.guestName });
      addToast('Guest checked in successfully!', 'success');
      addSystemEvent(`${booking.guestName} checked in to Room ${roomId || booking.room}`);
    }
  };

  const [loyaltyRules, setLoyaltyRules] = useState({
    minSpend: 1000,
    minVisits: 5
  });

  const checkOutGuest = (bookingId, services = [], paymentInfo = { status: 'paid', method: 'Credit Card' }) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      updateBooking(bookingId, { status: 'completed', paymentStatus: paymentInfo.status });
      updateRoomStatus(booking.room, { status: 'vacant', cleaning: 'dirty', guest: null });
      
      // Auto-generate invoice
      const roomCharges = booking.amount || 0;
      const servicesTotal = services.reduce((acc, s) => acc + (parseFloat(s.price) * s.qty), 0);
      const taxRate = 0.12; // 12% mock tax
      const subtotal = roomCharges + servicesTotal;
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;

      const newInvoice = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        bookingId: booking.id,
        guestName: booking.guestName,
        room: booking.room,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        amount: total,
        status: paymentInfo.status === 'paid' ? 'Paid' : 'Unpaid',
        method: paymentInfo.method,
        date: new Date().toISOString().split('T')[0],
        details: {
          roomCharges,
          services,
          subtotal,
          taxRate: 12,
          taxAmount,
          total
        }
      };

      // Update guest stats
      setGuests(prev => prev.map(g => {
        if (g.name === booking.guestName) {
          return {
            ...g,
            spent: g.spent + total,
            visits: g.visits + 1
          };
        }
        return g;
      }));

      setInvoices(prev => [newInvoice, ...prev]);
      addToast('Checkout completed! Invoice generated.', 'success');
      addSystemEvent(`${booking.guestName} checked out. Invoice ${newInvoice.id} created.`);
    }
  };

  const addInvoice = (invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    addToast('Invoice created successfully!');
  };

  const updateInvoiceStatus = (id, status, method) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status, method: method || inv.method } : inv
    ));
    addToast(`Invoice ${id} marked as ${status}`);
  };

  const assignHousekeeping = (roomId, staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      updateRoomStatus(roomId, { assignedStaff: staffMember.name });
      addToast(`Room ${roomId} assigned to ${staffMember.name}`, 'success');
      addSystemEvent(`Room ${roomId} assigned to ${staffMember.name}`);
    }
  };

  const markRoomMaintenance = (roomId) => {
    updateRoomStatus(roomId, { status: 'maintenance', cleaning: 'out_of_order' });
    addToast(`Room ${roomId} marked as Out of Order`, 'warning');
    addSystemEvent(`Room ${roomId} moved to Maintenance`);
  };

  const approveRequest = (req) => {
    const newUser = {
      id: Date.now(),
      name: req.hotelName.split(' ')[0] + ' Admin',
      email: req.email,
      role: 'Hotel Admin',
      property: req.hotelName,
      status: 'Active',
      joined: new Date().toISOString().split('T')[0]
    };
    setPlatformUsers(prev => [newUser, ...prev]);
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    addToast(`Request for ${req.hotelName} approved!`, 'success');
  };

  const rejectRequest = (id) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    addToast('Request rejected', 'warning');
  };

  const addPlatformUser = (user) => {
    const newUser = {
      id: Date.now(),
      ...user,
      joined: new Date().toISOString().split('T')[0]
    };
    setPlatformUsers(prev => [newUser, ...prev]);
    addToast('Platform user added successfully!');
  };

  const deletePlatformUser = (id) => {
    setPlatformUsers(prev => prev.filter(u => u.id !== id));
    addToast('User deleted');
  };

  const updatePlatformUser = (id, updates) => {
    setPlatformUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addToast('User details updated');
  };

  const addSubscription = (plan) => {
    setSubscriptions(prev => [...prev, { ...plan, id: Date.now() }]);
    addToast('Subscription plan added');
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    addToast('Subscription plan removed');
  };

  const updateSubscription = (id, updates) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addToast('Subscription plan updated');
  };

  const updatePlatformSettings = (updates) => {
    setPlatformSettings(prev => ({ ...prev, ...updates }));
    addToast('Platform settings updated');
  };

  const toggleFeatureToggle = (key) => {
    setFeatureToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAutoPilot = () => {
    setIsAutoPilot(!isAutoPilot);
    addToast(`Auto-Pilot ${!isAutoPilot ? 'Enabled' : 'Disabled'}`, 'success');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now() + Math.random(),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <AppContext.Provider value={{
      role, setRole,
      isAuthenticated, setIsAuthenticated,
      isInitializing, user, setUser,
      isSidebarOpen, setIsSidebarOpen, toggleSidebar,
      isAutoPilot, setIsAutoPilot,
      featureToggles, toggleFeatureToggle, toggleAutoPilot,
      toasts, addToast,
      automationLogs, addAutomationLog,
      rooms, updateRoomStatus, assignHousekeeping, markRoomMaintenance,
      bookings, addBooking, updateBooking, deleteBooking, checkInGuest, checkOutGuest,
      staff,
      guests, setGuests,
      loyaltyRules, setLoyaltyRules,
      invoices,
      hotels,
      systemEvents, addSystemEvent,
      platformUsers, addPlatformUser, deletePlatformUser, updatePlatformUser,
      pendingRequests, approveRequest, rejectRequest,
      subscriptions, addSubscription, deleteSubscription, updateSubscription,
      platformSettings, updatePlatformSettings,
      notifications, markNotificationRead, addNotification,
      rolePermissions, updateRolePermissions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
