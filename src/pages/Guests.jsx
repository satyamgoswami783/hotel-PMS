import React from 'react';
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
import { Card, Badge, Button } from '../components/common/UI';
import { cn } from '../utils/cn';

const Guests = () => {
  const guests = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', location: 'New York, USA', bookings: 12, spent: 4200, status: 'VIP' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 345 678 901', location: 'London, UK', bookings: 4, spent: 1500, status: 'Regular' },
    { id: 3, name: 'Michael Johnson', email: 'mike@example.com', phone: '+1 456 789 012', location: 'Berlin, DE', bookings: 1, spent: 300, status: 'New' },
    { id: 4, name: 'Robert Brown', email: 'robert@example.com', phone: '+1 567 890 123', location: 'Paris, FR', bookings: 8, spent: 2800, status: 'VIP' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Guest Management</h1>
          <p className="text-slate-500 mt-1">Unified profile database for personalized experiences.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><History size={18} /> Loyalty Rules</Button>
          <Button className="gap-2"><UserPlus size={18} /> Add New Guest</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email, or loyalty ID..."
              className="input-field pl-10" 
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Guests</span>
              <span className="text-lg font-black text-slate-800">1,248</span>
            </div>
            <div className="w-[1px] bg-slate-200 h-10"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">VIP Members</span>
              <span className="text-lg font-black text-primary-600">84</span>
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
              {guests.map((guest) => (
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
                      <span className="text-sm font-bold text-slate-800">{guest.bookings} Bookings</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Last stay: 2 weeks ago</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">${guest.spent.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={guest.status === 'VIP' ? 'primary' : guest.status === 'Regular' ? 'indigo' : 'slate'}>
                      {guest.status === 'VIP' && <Star size={10} className="inline mr-1" />} {guest.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="text-xs h-8">View Profile</Button>
                      <Button variant="secondary" className="p-1.5 h-8 w-8"><MoreVertical size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Guests;
