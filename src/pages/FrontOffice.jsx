import React, { useState } from 'react';
import { 
  LogIn, 
  LogOut, 
  UserCheck, 
  Search, 
  MoreHorizontal, 
  FileText, 
  Key,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, Modal } from '../components/common/UI';
import { cn } from '../utils/cn';

const FrontOffice = () => {
  const { rooms, bookings, guests, checkInGuest, checkOutGuest } = useApp();
  const [activeTab, setActiveTab] = useState('check-in');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Filter logic for lists
  const expectedToday = bookings.filter(b => b.status === 'confirmed' && !rooms.find(r => r.guest === b.guestName));
  const inHouse = rooms.filter(r => r.status === 'occupied').map(r => ({
    id: r.id, guestName: r.guest, room: r.id, roomType: r.type, status: 'In-House', payment: 'Paid'
  }));
  const expectedOut = inHouse.filter(g => true); // Mock for today

  const getTableData = () => {
    switch (activeTab) {
      case 'check-in': return expectedToday.map(b => ({ ...b, status: 'Expected', roomType: 'Deluxe' }));
      case 'check-out': return expectedOut;
      case 'in-house': return inHouse;
      default: return [];
    }
  };

  const handleAction = (item) => {
    setSelectedItem(item);
    if (activeTab === 'check-in') {
      const guest = guests.find(g => g.name === item.guestName);
      checkInGuest(guest?.id || 1, item.room);
    } else if (activeTab === 'check-out') {
      setIsInvoiceModalOpen(true);
    }
  };

  const confirmCheckOut = () => {
    checkOutGuest(selectedItem.room);
    setIsInvoiceModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Front Office</h1>
          <p className="text-slate-500 mt-1">Manage guest arrivals, departures and in-house requests.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['check-in', 'in-house', 'check-out'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                activeTab === tab ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Filter by guest or room..." className="input-field pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {getTableData().map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {item.guestName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.guestName}</p>
                        <p className="text-xs text-slate-500">Stay: 4 Nights</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">Room {item.room}</td>
                  <td className="px-6 py-4"><Badge variant={activeTab === 'check-in' ? 'primary' : 'success'}>{item.status}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={item.paymentStatus === 'paid' || item.payment === 'Paid' ? 'success' : 'warning'}>Paid</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      onClick={() => handleAction(item)}
                      className={cn(
                        "h-8 px-4 text-xs",
                        activeTab === 'check-in' ? "bg-emerald-600 hover:bg-emerald-700" : 
                        activeTab === 'check-out' ? "bg-rose-600 hover:bg-rose-700" : "bg-primary-600"
                      )}
                    >
                      {activeTab === 'check-in' ? 'Check-in' : activeTab === 'check-out' ? 'Check-out' : 'Details'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        title="Generate Invoice & Check-out"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmCheckOut} className="bg-rose-600 hover:bg-rose-700">Confirm Payment & Check-out</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-900">Guest: {selectedItem?.guestName}</h4>
              <p className="text-sm text-slate-500">Room {selectedItem?.room} • 4 Nights</p>
            </div>
            <Badge variant="success">Paid in Full</Badge>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Room Charges</span><span className="font-bold">$600.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Taxes (12%)</span><span className="font-bold">$72.00</span></div>
            <div className="h-[1px] bg-slate-200 border-dashed border"></div>
            <div className="flex justify-between"><span className="font-bold">Total Amount</span><span className="text-lg font-black text-primary-600">$672.00</span></div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 text-emerald-800">
            <CreditCard className="shrink-0" size={20} />
            <p className="text-xs font-medium">Payment was successfully processed via Visa ending in 4242.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FrontOffice;
