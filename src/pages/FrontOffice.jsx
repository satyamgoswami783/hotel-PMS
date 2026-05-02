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
  const { rooms, bookings, guests, checkInGuest, checkOutGuest, addToast, updateBooking } = useApp();
  const [activeTab, setActiveTab] = useState('check-in');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Filter logic for lists
  const getTableData = () => {
    let data = [];
    switch (activeTab) {
      case 'check-in': 
        data = bookings.filter(b => b.status === 'confirmed');
        break;
      case 'check-out': 
        data = bookings.filter(b => b.status === 'checked-in'); // Simplified: all in-house can checkout
        break;
      case 'in-house': 
        data = bookings.filter(b => b.status === 'checked-in');
        break;
      default: data = [];
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.guestName.toLowerCase().includes(q) || 
        item.room.toLowerCase().includes(q)
      );
    }
    return data;
  };

  const handleAction = (item) => {
    setSelectedItem(item);
    if (activeTab === 'check-in') {
      checkInGuest(item.id);
    } else if (activeTab === 'check-out') {
      setIsInvoiceModalOpen(true);
    } else if (activeTab === 'in-house') {
      // Show details or quick actions
      setIsServiceModalOpen(true);
    }
  };

  const confirmCheckOut = () => {
    checkOutGuest(selectedItem.id);
    setIsInvoiceModalOpen(false);
  };

  const handleAddService = () => {
    addToast(`Service added to ${selectedItem.guestName}'s room`);
    setIsServiceModalOpen(false);
  };

  const handleExtendStay = () => {
    addToast(`Stay extended for ${selectedItem.guestName}`);
    setIsServiceModalOpen(false);
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
            <input 
              type="text" 
              placeholder="Filter by guest or room..." 
              className="input-field pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              {getTableData().length > 0 ? getTableData().map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {item.guestName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.guestName}</p>
                        <p className="text-xs text-slate-500">Dates: {item.checkIn} to {item.checkOut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">Room {item.room}</td>
                  <td className="px-6 py-4"><Badge variant={activeTab === 'check-in' ? 'primary' : 'success'}>{item.status}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={item.paymentStatus === 'paid' ? 'success' : 'warning'}>{item.paymentStatus}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      onClick={() => handleAction(item)}
                      className={cn(
                        "h-8 px-4 text-xs",
                        activeTab === 'check-in' ? "bg-emerald-600 hover:bg-emerald-700" : 
                        activeTab === 'check-out' ? "bg-rose-600 hover:bg-rose-700" : "bg-primary-600"
                      )}
                    >
                      {activeTab === 'check-in' ? 'Check-in' : activeTab === 'check-out' ? 'Check-out' : 'Actions'}
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No guests found for {activeTab}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        title="Generate Invoice & Check-out"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmCheckOut} className="flex-1 bg-rose-600 hover:bg-rose-700">Confirm & Check-out</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-900">Guest: {selectedItem?.guestName}</h4>
              <p className="text-sm text-slate-500">Room {selectedItem?.room} • Stay: {selectedItem?.checkIn} - {selectedItem?.checkOut}</p>
            </div>
            <Badge variant={selectedItem?.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {selectedItem?.paymentStatus === 'paid' ? 'Paid in Full' : 'Pending Payment'}
            </Badge>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Stay Charges</span><span className="font-bold">${selectedItem?.amount || 0}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Taxes & Fees</span><span className="font-bold">$0.00</span></div>
            <div className="h-[1px] bg-slate-200 border-dashed border"></div>
            <div className="flex justify-between"><span className="font-bold">Total Amount</span><span className="text-lg font-black text-primary-600">${selectedItem?.amount || 0}</span></div>
          </div>
          {selectedItem?.paymentStatus === 'paid' && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 text-emerald-800">
              <CreditCard className="shrink-0" size={20} />
              <p className="text-xs font-medium">Payment was successfully processed.</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Guest Services"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsServiceModalOpen(false)}>Close</Button>
            <Button onClick={handleExtendStay} className="flex-1">Extend Stay</Button>
            <Button onClick={handleAddService} className="flex-1 bg-primary-600">Add Service</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In-House Guest</p>
            <p className="text-lg font-bold text-slate-800">{selectedItem?.guestName}</p>
            <p className="text-sm text-slate-500">Room {selectedItem?.room}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Key size={16} /></div>
              <div>
                <p className="text-sm font-bold text-slate-800">Room Key Issue</p>
                <p className="text-[10px] text-slate-500">Generate new digital/physical key</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><FileText size={16} /></div>
              <div>
                <p className="text-sm font-bold text-slate-800">Add Room Service</p>
                <p className="text-[10px] text-slate-500">Post charges to guest folio</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FrontOffice;
