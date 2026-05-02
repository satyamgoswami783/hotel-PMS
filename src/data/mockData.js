export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOTEL_ADMIN: 'hotel_admin',
  FRONT_DESK: 'front_desk',
  HOUSEKEEPING: 'housekeeping',
};

export const INITIAL_HOTELS = [
  { id: 'H1', name: 'Grand AutoPilot Resort', location: 'New York, USA', admin: 'manager@grandresort.com', rooms: 120, status: 'Active', plan: 'Enterprise' },
  { id: 'H2', name: 'Azure Bay Hotel', location: 'Miami, USA', admin: 'admin@azurebay.com', rooms: 85, status: 'Active', plan: 'Standard' },
  { id: 'H3', name: 'Urban Peak Suites', location: 'London, UK', admin: 'london@urbanpeak.com', rooms: 45, status: 'Pending', plan: 'Trial' },
];

export const INITIAL_ROOMS = [
  { id: '101', type: 'Deluxe', status: 'occupied', cleaning: 'clean', guest: 'John Doe', price: 150 },
  { id: '102', type: 'Deluxe', status: 'vacant', cleaning: 'dirty', guest: null, price: 150 },
  { id: '103', type: 'Suite', status: 'occupied', cleaning: 'clean', guest: 'Jane Smith', price: 300 },
  { id: '201', type: 'Standard', status: 'vacant', cleaning: 'clean', guest: null, price: 100 },
  { id: '202', type: 'Standard', status: 'maintenance', cleaning: 'maintenance', guest: null, price: 100 },
  { id: '203', type: 'Deluxe', status: 'vacant', cleaning: 'clean', guest: null, price: 150 },
  { id: '301', type: 'Presidential', status: 'vacant', cleaning: 'clean', guest: null, price: 800 },
  { id: '302', type: 'occupied', status: 'occupied', cleaning: 'dirty', guest: 'Alice Wilson', price: 300 },
];

export const INITIAL_BOOKINGS = [
  { id: 'B1', guestName: 'John Doe', room: '101', checkIn: '2026-05-01', checkOut: '2026-05-05', status: 'confirmed', amount: 600, paymentStatus: 'paid' },
  { id: 'B2', guestName: 'Jane Smith', room: '103', checkIn: '2026-05-02', checkOut: '2026-05-04', status: 'confirmed', amount: 600, paymentStatus: 'pending' },
  { id: 'B3', guestName: 'Mike Johnson', room: '201', checkIn: '2026-05-03', checkOut: '2026-05-06', status: 'pending', amount: 300, paymentStatus: 'unpaid' },
];

export const INITIAL_GUESTS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', location: 'New York, USA', bookings: 12, spent: 4200, status: 'VIP' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 345 678 901', location: 'London, UK', bookings: 4, spent: 1500, status: 'Regular' },
  { id: 3, name: 'Michael Johnson', email: 'mike@example.com', phone: '+1 456 789 012', location: 'Berlin, DE', bookings: 1, spent: 300, status: 'New' },
  { id: 4, name: 'Robert Brown', email: 'robert@example.com', phone: '+1 567 890 123', location: 'Paris, FR', bookings: 8, spent: 2800, status: 'VIP' },
];

export const INITIAL_STAFF = [
  { id: 'S1', name: 'Maria Garcia', role: 'Housekeeping', status: 'Available' },
  { id: 'S2', name: 'David Chen', role: 'Housekeeping', status: 'Busy' },
  { id: 'S3', name: 'Sarah Miller', role: 'Housekeeping', status: 'Available' },
];
