import React, { useState } from 'react';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, X,
  Calendar as CalendarIcon, CreditCard, User, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, Drawer } from '../components/common/UI';
import { cn } from '../utils/cn';

const Reservations = () => {
  const { bookings, addBooking, rooms } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
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
      alert('Please fill all required fields');
      return;
    }
    
    addBooking({
      ...formData,
      status: 'confirmed',
      amount: formData.price,
      paymentStatus: 'pending'
    });
    setIsDrawerOpen(false);
  };

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
            <input type="text" placeholder="Search bookings..." className="input-field pl-10" />
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
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 border-b border-slate-100 sticky left-0 bg-white z-10 font-bold text-slate-800 text-sm">Room {room.id}</td>
                  {[1, 2, 3, 4, 5, 6, 7].map(day => {
                    const booking = bookings.find(b => b.room === room.id && parseInt(b.checkIn.split('-')[2]) <= day && parseInt(b.checkOut.split('-')[2]) >= day);
                    const isStart = booking && parseInt(booking.checkIn.split('-')[2]) === day;
                    return (
                      <td key={day} className="px-1 py-4 border-b border-slate-100 relative h-20">
                        {booking && (
                          <div 
                            onClick={() => handleOpenDrawer(booking)}
                            className={cn(
                              "absolute inset-y-3 inset-x-0 mx-1 rounded-xl p-3 cursor-pointer shadow-sm flex flex-col justify-center border-l-4",
                              booking.status === 'confirmed' ? "bg-primary-50 border-primary-500 text-primary-900" : "bg-amber-50 border-amber-500 text-amber-900"
                            )}
                          >
                            {isStart && <p className="text-[10px] font-black truncate uppercase">{booking.guestName}</p>}
                          </div>
                        )}
                      </td>
                    );
                  })}
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
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            {!selectedBooking && <Button className="flex-1" onClick={handleSubmit}>Confirm Booking</Button>}
          </>
        }
      >
        <form className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Guest Information</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" className="input-field pl-10" placeholder="Full Name" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} disabled={!!selectedBooking} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Check-in</label>
              <input type="date" className="input-field" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} disabled={!!selectedBooking} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Check-out</label>
              <input type="date" className="input-field" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} disabled={!!selectedBooking} />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Room Selection</label>
            <select className="input-field" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} disabled={!!selectedBooking}>
              {rooms.map(r => <option key={r.id} value={r.id}>Room {r.id} - {r.type}</option>)}
            </select>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Total Price</span>
              <span className="text-sm font-black text-slate-900">$300.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 font-medium">Payment Status</span>
              <Badge variant={selectedBooking?.paymentStatus === 'paid' ? 'success' : 'warning'}>{selectedBooking?.paymentStatus || 'Pending'}</Badge>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Reservations;
