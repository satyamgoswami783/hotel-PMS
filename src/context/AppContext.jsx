import React, { createContext, useContext, useState } from 'react';
import { 
  ROLES, 
  INITIAL_HOTELS, 
  INITIAL_ROOMS, 
  INITIAL_BOOKINGS, 
  INITIAL_GUESTS,
  INITIAL_STAFF 
} from '../data/mockData';

const AppContext = createContext();

export { ROLES };

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.HOTEL_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // ACTIONS
  const updateRoomStatus = (roomId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updates } : room));
  };

  const addBooking = (newBooking) => {
    const id = `B${bookings.length + 1}`;
    setBookings(prev => [...prev, { id, ...newBooking }]);
    addToast('New booking added successfully!');
  };

  const checkInGuest = (guestId, roomId) => {
    updateRoomStatus(roomId, { status: 'occupied', guest: guests.find(g => g.id === guestId)?.name || 'Guest' });
    addToast(`Guest checked in to Room ${roomId}`);
  };

  const checkOutGuest = (roomId) => {
    updateRoomStatus(roomId, { status: 'vacant', cleaning: 'dirty', guest: null });
    addToast(`Guest checked out from Room ${roomId}. Room marked dirty.`);
  };

  const assignHousekeeping = (roomId, staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    addToast(`Assigned ${staffMember.name} to Room ${roomId}`);
  };

  const toggleAutoPilot = () => {
    setIsAutoPilot(!isAutoPilot);
    addToast(`Auto-Pilot ${!isAutoPilot ? 'Enabled' : 'Disabled'}`);
  };

  const [platformUsers, setPlatformUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@grandresort.com', role: 'Hotel Admin', property: 'Grand AutoPilot Resort', status: 'Active', joined: '2026-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@azurebay.com', role: 'Hotel Admin', property: 'Azure Bay Hotel', status: 'Active', joined: '2026-02-10' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@urbanpeak.com', role: 'Hotel Admin', property: 'Urban Peak Suites', status: 'Pending', joined: '2026-05-01' },
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
    { id: 1, title: 'New Hotel Added', message: 'Grand AutoPilot Resort joined the platform.', time: '2 mins ago', type: 'info', read: false },
    { id: 2, title: 'Subscription Expiring', message: 'Azure Bay Hotel plan expires in 3 days.', time: '1 hour ago', type: 'warning', read: false },
  ]);

  const addPlatformUser = (user) => {
    setPlatformUsers(prev => [...prev, { 
      id: prev.length + 1, 
      ...user, 
      role: 'Hotel Admin', 
      status: 'Pending', 
      joined: new Date().toISOString().split('T')[0] 
    }]);
    addToast(`Invitation sent to ${user.email} successfully!`);
  };

  const addSubscription = (plan) => {
    setSubscriptions(prev => [...prev, { id: prev.length + 1, ...plan }]);
    addToast('New subscription plan created!');
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    addToast('Subscription plan deleted.', 'error');
  };

  const updatePlatformSettings = (settings) => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
    addToast('Platform settings updated successfully!');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addHotel = (hotel) => {
    setHotels(prev => [...prev, { id: `H${prev.length + 1}`, ...hotel, status: 'Active' }]);
    addToast('New hotel added to platform!');
  };

  const deleteHotel = (id) => {
    setHotels(prev => prev.filter(h => h.id !== id));
    addToast('Hotel removed from platform.', 'error');
  };

  const updateHotel = (id, updates) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    addToast('Hotel information updated.');
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      isAuthenticated, setIsAuthenticated,
      hotels, addHotel, deleteHotel, updateHotel,
      rooms, updateRoomStatus,
      bookings, addBooking,
      guests,
      staff,
      isAutoPilot, toggleAutoPilot,
      checkInGuest, checkOutGuest,
      assignHousekeeping,
      toasts, addToast,
      platformUsers, addPlatformUser,
      subscriptions, addSubscription, deleteSubscription,
      platformSettings, updatePlatformSettings,
      notifications, markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
