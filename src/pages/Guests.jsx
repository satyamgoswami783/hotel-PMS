import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  History,
  MoreVertical
} from 'lucide-react';
import { Card, Badge, Button, Drawer, Modal } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const Guests = () => {
  const { guests, addGuest, updateGuest, deleteGuest, bookings, invoices } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', status: 'Regular' });

  const handleOpenModal = (guest = null) => {
    if (guest) {
      setSelectedGuest(guest);
      setFormData({ name: guest.name, email: guest.email, phone: guest.phone, location: guest.location, status: guest.status });
    } else {
      setSelectedGuest(null);
      setFormData({ name: '', email: '', phone: '', location: '', status: 'Regular' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGuest) {
      updateGuest(selectedGuest.id, formData);
    } else {
      addGuest(formData);
    }
    setIsModalOpen(false);
  };

  const handleViewProfile = (guest) => {
    setSelectedGuest(guest);
    setIsProfileOpen(true);
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const guestBookings = selectedGuest ? bookings.filter(b => b.guestName === selectedGuest.name) : [];
  const guestInvoices = selectedGuest ? invoices.filter(i => i.guestName === selectedGuest.name) : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Guest Management</h1>
          <p className="text-slate-500 mt-1">Unified profile database for personalized experiences.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><History size={18} /> Loyalty Rules</Button>
          <Button className="gap-2" onClick={() => handleOpenModal()}><UserPlus size={18} /> Add New Guest</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="input-field pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Guests</span>
              <span className="text-lg font-black text-slate-800">{guests.length}</span>
            </div>
            <div className="w-[1px] bg-slate-200 h-10"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">VIP Members</span>
              <span className="text-lg font-black text-primary-600">{guests.filter(g => g.status === 'VIP').length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">History</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {guest.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{guest.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-slate-400" />
                          <span className="text-[10px] text-slate-500">{guest.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" /> {guest.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" /> {guest.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{guest.bookings || 0} Bookings</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">${(guest.spent || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={guest.status === 'VIP' ? 'primary' : guest.status === 'Regular' ? 'indigo' : 'slate'}>
                      {guest.status === 'VIP' && <Star size={10} className="inline mr-1" />} {guest.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="text-xs h-8" onClick={() => handleViewProfile(guest)}>View Profile</Button>
                      <Button variant="secondary" className="p-1.5 h-8 w-8" onClick={() => handleOpenModal(guest)}><MoreVertical size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedGuest ? 'Edit Guest' : 'Add New Guest'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
            <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
              <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone</label>
              <input type="text" required className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Location</label>
            <input type="text" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{selectedGuest ? 'Update Guest' : 'Create Profile'}</Button>
          </div>
        </form>
      </Modal>

      <Drawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Guest Profile">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-black text-2xl">
              {selectedGuest?.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{selectedGuest?.name}</h2>
              <Badge variant={selectedGuest?.status === 'VIP' ? 'primary' : 'slate'}>{selectedGuest?.status}</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stay History</h4>
            <div className="space-y-3">
              {guestBookings.length > 0 ? guestBookings.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-800">Room {b.room}</p>
                    <Badge variant="success">{b.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{b.checkIn} - {b.checkOut}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No booking history available.</p>}
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">Payment History</h4>
            <div className="space-y-3">
              {guestInvoices.length > 0 ? guestInvoices.map(i => (
                <div key={i.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-800">{i.id}</p>
                    <p className="text-sm font-black text-slate-900">${i.amount}</p>
                  </div>
                  <Badge variant={i.status === 'Paid' ? 'success' : 'warning'} className="mt-2">{i.status}</Badge>
                </div>
              )) : <p className="text-sm text-slate-400">No payment history available.</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-8">
            <Button variant="danger" className="flex-1" onClick={() => { deleteGuest(selectedGuest.id); setIsProfileOpen(false); }}>Delete Guest</Button>
            <Button variant="secondary" className="flex-1" onClick={() => { setIsProfileOpen(false); handleOpenModal(selectedGuest); }}>Edit Profile</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Guests;
