import React, { useState } from 'react';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, X,
  Calendar as CalendarIcon, CreditCard, User, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, Drawer } from '../components/common/UI';
import { cn } from '../utils/cn';

const Reservations = () => {
  const { bookings, addBooking, updateBooking, deleteBooking, rooms, addToast } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    guestName: '',
    room: '101',
    checkIn: '',
    checkOut: '',
    roomType: 'Deluxe',
    price: 150
  });

  const handleOpenDrawer = (booking = null) => {
    setSelectedBooking(booking);
    if (booking) {
      setFormData({
        guestName: booking.guestName,
        room: booking.room,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        roomType: 'Deluxe',
        price: booking.amount
      });
    } else {
      setFormData({
        guestName: '',
        room: '101',
        checkIn: '',
        checkOut: '',
        roomType: 'Deluxe',
        price: 150
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.checkIn || !formData.checkOut) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    
    let success = false;
    if (selectedBooking) {
      success = updateBooking(selectedBooking.id, formData);
    } else {
      success = addBooking({
        ...formData,
        status: 'confirmed',
        amount: formData.price,
        paymentStatus: 'pending'
      });
    }
    
    if (success) {
      setIsDrawerOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking.id);
      setIsDrawerOpen(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const hasBookingMatch = bookings.some(b => 
      b.room === room.id && 
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return searchQuery === '' || room.id.includes(searchQuery) || hasBookingMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reservations</h1>
          <p className="text-slate-500 mt-1">Manage guest bookings and room availability.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search bookings or rooms..." 
              className="input-field pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="px-3"><Filter size={18} /></Button>
          <Button onClick={() => handleOpenDrawer()} className="gap-2">
            <Plus size={18} /> New Booking
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800">Booking Timeline</h3>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button className="px-3 py-1 text-xs font-bold bg-primary-600 text-white rounded-md">Day</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md">Week</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="p-1.5 h-auto"><ChevronLeft size={16} /></Button>
            <span className="text-sm font-bold text-slate-700 mx-2">May 01 - May 07, 2026</span>
            <Button variant="secondary" className="p-1.5 h-auto"><ChevronRight size={16} /></Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 w-48 sticky left-0 bg-slate-50 z-10">Room</th>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <th key={day} className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 min-w-[120px]">May 0{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="h-20 hover:bg-slate-50/50 transition-colors relative">
                  <td className="px-6 py-4 border-b border-slate-100 sticky left-0 bg-white z-10 font-bold text-slate-800 text-sm w-48 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Room {room.id}
                    <p className="text-[10px] text-slate-400 font-medium">{room.type}</p>
                  </td>
                  <td colSpan={7} className="p-0 border-b border-slate-100 relative h-20">
                    {/* Day Grid Lines */}
                    <div className="absolute inset-0 flex">
                      {[1, 2, 3, 4, 5, 6, 7].map(day => (
                        <div key={day} className="flex-1 border-r border-slate-50 last:border-0" />
                      ))}
                    </div>
                    
                    {/* Booking Bars */}
                    {bookings.filter(b => b.room === room.id).map((booking) => {
                      const startDay = parseInt(booking.checkIn.split('-')[2]);
                      const endDay = parseInt(booking.checkOut.split('-')[2]);
                      
                      // Only show if within range (May 01 - May 07)
                      const visibleStart = Math.max(1, startDay);
                      const visibleEnd = Math.min(7, endDay);
                      
                      if (visibleStart > 7 || visibleEnd < 1) return null;
                      
                      const left = ((visibleStart - 1) / 7) * 100;
                      const width = ((visibleEnd - visibleStart + 1) / 7) * 100;
                      
                      return (
                        <div 
                          key={booking.id}
                          onClick={() => handleOpenDrawer(booking)}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          className={cn(
                            "absolute top-4 bottom-4 mx-0.5 rounded-xl p-3 cursor-pointer shadow-md flex flex-col justify-center border-l-4 transition-all hover:scale-[1.01] hover:shadow-lg z-20 overflow-hidden",
                            booking.status === 'checked-in' ? "bg-emerald-600 border-emerald-400 text-white" :
                            booking.status === 'checked-out' ? "bg-slate-400 border-slate-300 text-white" :
                            "bg-primary-600 border-primary-400 text-white"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider truncate">{booking.guestName}</span>
                            <span className="text-[9px] opacity-80 font-medium truncate">{booking.id} • ${booking.amount}</span>
                          </div>
                        </div>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={selectedBooking ? 'Booking Details' : 'New Reservation'}
        subtitle="Manage stay details and room assignment."
        footer={
          <div className="flex gap-3 w-full">
            {selectedBooking ? (
              <>
                <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
                <Button className="flex-1" onClick={handleSubmit}>Update Booking</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className="flex-1" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSubmit}>Confirm Booking</Button>
              </>
            )}
          </div>
        }
      >
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Guest Information</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                className="input-field pl-10" 
                placeholder="Full Name" 
                value={formData.guestName} 
                onChange={e => setFormData({...formData, guestName: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Check-in</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.checkIn} 
                onChange={e => setFormData({...formData, checkIn: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Check-out</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.checkOut} 
                onChange={e => setFormData({...formData, checkOut: e.target.value})} 
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Room Selection</label>
            <select 
              className="input-field" 
              value={formData.room} 
              onChange={e => setFormData({...formData, room: e.target.value})}
            >
              {rooms.map(r => <option key={r.id} value={r.id}>Room {r.id} - {r.type}</option>)}
            </select>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Amount</span>
              <span className="text-sm font-black text-slate-900">${formData.price || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 font-medium">Payment Status</span>
              <Badge variant={selectedBooking?.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {selectedBooking?.paymentStatus || 'Pending'}
              </Badge>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Reservations;
