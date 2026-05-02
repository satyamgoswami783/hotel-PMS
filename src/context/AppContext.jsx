import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ROLES, 
  INITIAL_HOTELS, 
  INITIAL_ROOMS, 
  INITIAL_BOOKINGS, 
  INITIAL_GUESTS,
  INITIAL_STAFF,
  INITIAL_INVOICES,
  INITIAL_AUTOMATION_LOGS
} from '../data/mockData';

const AppContext = createContext();

const getLocalStorage = (key, initialValue) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return initialValue;
    }
  }
  return initialValue;
};

export { ROLES };

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(() => getLocalStorage('role', ROLES.HOTEL_ADMIN));
  const [isAuthenticated, setIsAuthenticated] = useState(() => getLocalStorage('isAuthenticated', false));
  const [hotels, setHotels] = useState(() => getLocalStorage('hotels', INITIAL_HOTELS));
  const [rooms, setRooms] = useState(() => getLocalStorage('rooms', INITIAL_ROOMS));
  const [bookings, setBookings] = useState(() => getLocalStorage('bookings', INITIAL_BOOKINGS));
  const [guests, setGuests] = useState(() => getLocalStorage('guests', INITIAL_GUESTS));
  const [staff, setStaff] = useState(() => getLocalStorage('staff', INITIAL_STAFF));
  const [invoices, setInvoices] = useState(() => getLocalStorage('invoices', INITIAL_INVOICES));
  const [automationLogs, setAutomationLogs] = useState(() => getLocalStorage('automationLogs', INITIAL_AUTOMATION_LOGS));
  const [isAutoPilot, setIsAutoPilot] = useState(() => getLocalStorage('isAutoPilot', false));
  const [toasts, setToasts] = useState([]);
  const [systemEvents, setSystemEvents] = useState(() => getLocalStorage('systemEvents', [
    { id: 1, type: 'info', message: 'System initialized', time: 'Just now' },
    { id: 2, type: 'warning', message: 'Room 202 needs maintenance', time: '1 hour ago' }
  ]));

  // Persistence
  useEffect(() => {
    localStorage.setItem('role', JSON.stringify(role));
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('hotels', JSON.stringify(hotels));
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('guests', JSON.stringify(guests));
    localStorage.setItem('staff', JSON.stringify(staff));
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('automationLogs', JSON.stringify(automationLogs));
    localStorage.setItem('isAutoPilot', JSON.stringify(isAutoPilot));
    localStorage.setItem('systemEvents', JSON.stringify(systemEvents));
  }, [role, isAuthenticated, hotels, rooms, bookings, guests, staff, invoices, automationLogs, isAutoPilot, systemEvents]);

  const addToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addSystemEvent = (message, type = 'info') => {
    const newEvent = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message,
      type,
      time: 'Just now'
    };
    setSystemEvents(prev => [newEvent, ...prev.slice(0, 9)]);
  };

  // ROOM ACTIONS
  const updateRoomStatus = (roomId, updates) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updates } : room));
    if (updates.status) addSystemEvent(`Room ${roomId} status changed to ${updates.status}`);
  };

  // BOOKING ACTIONS
  const addBooking = (newBooking) => {
    // Check for double booking
    const isOverlapping = bookings.some(b => {
      if (b.room !== newBooking.room) return false;
      if (b.status === 'checked-out' || b.status === 'cancelled') return false;
      
      const newStart = new Date(newBooking.checkIn);
      const newEnd = new Date(newBooking.checkOut);
      const existingStart = new Date(b.checkIn);
      const existingEnd = new Date(b.checkOut);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (isOverlapping) {
      addToast('Error: Room is already booked for these dates!', 'error');
      return false;
    }

    const id = `B${bookings.length + 1}`;
    const booking = { id, status: 'confirmed', paymentStatus: 'pending', ...newBooking };
    setBookings(prev => [...prev, booking]);
    
    // Update room status if room is assigned
    if (newBooking.room) {
      updateRoomStatus(newBooking.room, { status: 'occupied', guest: newBooking.guestName });
    }
    
    addToast('New booking added successfully!');
    addSystemEvent(`New booking ${id} for ${newBooking.guestName}`);
    return true;
  };

  const updateBooking = (id, updates) => {
    // Check for double booking (excluding self)
    const isOverlapping = bookings.some(b => {
      if (b.id === id) return false;
      const roomToCheck = updates.room || b.room;
      if (b.room !== roomToCheck) return false;
      if (b.status === 'checked-out' || b.status === 'cancelled') return false;
      
      const newStart = new Date(updates.checkIn || b.checkIn);
      const newEnd = new Date(updates.checkOut || b.checkOut);
      const existingStart = new Date(b.checkIn);
      const existingEnd = new Date(b.checkOut);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (isOverlapping) {
      addToast('Error: Room is already booked for these dates!', 'error');
      return false;
    }

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
    addToast('Booking deleted.', 'error');
  };

  // GUEST ACTIONS
  const addGuest = (newGuest) => {
    const id = guests.length + 1;
    setGuests(prev => [...prev, { id, ...newGuest, bookings: 0, spent: 0, status: 'New' }]);
    addToast('Guest added successfully!');
  };

  const updateGuest = (id, updates) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    addToast('Guest profile updated.');
  };

  const deleteGuest = (id) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    addToast('Guest removed.', 'error');
  };

  // FRONT OFFICE ACTIONS
  const checkInGuest = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      updateBooking(bookingId, { status: 'checked-in' });
      updateRoomStatus(booking.room, { status: 'occupied', guest: booking.guestName });
      addToast(`Guest ${booking.guestName} checked in to Room ${booking.room}`);
      addSystemEvent(`${booking.guestName} checked in`);
    }
  };

  const checkOutGuest = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      updateBooking(bookingId, { status: 'checked-out' });
      updateRoomStatus(booking.room, { status: 'vacant', cleaning: 'dirty', guest: null });
      
      // Create Invoice
      const newInvoice = {
        id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        guestName: booking.guestName,
        amount: booking.amount || 0,
        status: booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid',
        date: new Date().toISOString().split('T')[0],
        method: 'Pending'
      };
      setInvoices(prev => [newInvoice, ...prev]);
      
      addToast(`Guest checked out from Room ${booking.room}. Invoice generated.`);
      addSystemEvent(`${booking.guestName} checked out`);
    }
  };

  // HOUSEKEEPING ACTIONS
  const assignHousekeeping = (roomId, staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    updateRoomStatus(roomId, { cleaning: 'cleaning', assignedStaff: staffMember.name });
    addToast(`Assigned ${staffMember.name} to Room ${roomId}`);
    addSystemEvent(`Staff ${staffMember.name} assigned to Room ${roomId}`);
  };

  // BILLING ACTIONS
  const addInvoice = (invoice) => {
    setInvoices(prev => [{ id: `INV-${Math.floor(Math.random() * 9000) + 1000}`, ...invoice, date: new Date().toISOString().split('T')[0] }, ...prev]);
    addToast('Invoice created successfully!');
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    addToast(`Invoice marked as ${status}`);
  };

  // AUTOMATION ACTIONS
  const toggleAutoPilot = () => {
    setIsAutoPilot(!isAutoPilot);
    addToast(`Auto-Pilot ${!isAutoPilot ? 'Enabled' : 'Disabled'}`);
    if (!isAutoPilot) {
      const log = { id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, action: 'System Update', details: 'Auto-Pilot system activated', time: 'Just now' };
      setAutomationLogs(prev => [log, ...prev]);
    }
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
      bookings, addBooking, updateBooking, deleteBooking,
      guests, addGuest, updateGuest, deleteGuest,
      staff,
      invoices, addInvoice, updateInvoiceStatus,
      automationLogs,
      isAutoPilot, toggleAutoPilot,
      checkInGuest, checkOutGuest,
      assignHousekeeping,
      toasts, addToast,
      systemEvents,
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
