import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  FileText, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const Billing = () => {
  const { invoices, updateInvoiceStatus, addInvoice, addToast, guests } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ guestName: '', amount: '', status: 'Unpaid', method: 'Credit Card' });

  const handleSendInvoice = (id) => {
    addToast(`Invoice ${id} sent to guest email.`);
  };

  const handleDownloadPDF = (inv) => {
    addToast(`Generating PDF for ${inv.id}...`);
    setTimeout(() => {
      const content = `Invoice ID: ${inv.id}\nGuest: ${inv.guestName}\nAmount: $${inv.amount}\nStatus: ${inv.status}\nDate: ${inv.date}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${inv.id}.pdf`;
      link.click();
      addToast('Invoice PDF downloaded.');
    }, 1500);
  };

  const handleMarkPaid = (id) => {
    updateInvoiceStatus(id, 'Paid');
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    addInvoice({ ...newInvoice, amount: parseFloat(newInvoice.amount) });
    setIsCreateModalOpen(false);
    setNewInvoice({ guestName: '', amount: '', status: 'Unpaid', method: 'Credit Card' });
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || inv.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = invoices.reduce((acc, inv) => inv.status === 'Paid' ? acc + inv.amount : acc, 0);
  const pendingRevenue = invoices.reduce((acc, inv) => inv.status !== 'Paid' ? acc + inv.amount : acc, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Payments</h1>
          <p className="text-slate-500 mt-1">Track invoices, payments, and financial records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" onClick={() => addToast('Exporting financial records...')}><Download size={18} /> Export CSV</Button>
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}><FileText size={18} /> Create Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Find invoice or guest..."
                className="input-field pl-10 h-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Paid', 'Pending', 'Unpaid'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold transition-all",
                    filterStatus === status ? "bg-primary-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{inv.id}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{inv.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{inv.guestName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">${inv.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={inv.status.toLowerCase() === 'paid' ? 'success' : inv.status.toLowerCase() === 'overdue' ? 'error' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {inv.status !== 'Paid' && (
                          <Button variant="secondary" className="p-1.5 h-auto" onClick={() => handleMarkPaid(inv.id)} title="Mark Paid"><CheckCircle2 size={14} /></Button>
                        )}
                        <Button variant="secondary" className="p-1.5 h-auto" onClick={() => handleSendInvoice(inv.id)} title="Send Email"><Send size={14} /></Button>
                        <Button variant="secondary" className="p-1.5 h-auto" onClick={() => handleDownloadPDF(inv)} title="Download PDF"><Download size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Quick Statistics">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase">Total Revenue (Paid)</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-black text-emerald-700">${totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase">Pending Payments</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-black text-amber-700">${pendingRevenue.toLocaleString()}</h3>
                  <span className="text-xs text-slate-400 font-bold">{invoices.filter(inv => inv.status !== 'Paid').length} Invoices</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Payment Methods">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Credit Card</span>
                </div>
                <span className="text-xs font-bold text-slate-500">65%</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Digital Wallet</span>
                </div>
                <span className="text-xs font-bold text-slate-500">28%</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Cash / Others</span>
                </div>
                <span className="text-xs font-bold text-slate-500">7%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Guest Name</label>
            <select 
              className="input-field" 
              required 
              value={newInvoice.guestName}
              onChange={(e) => setNewInvoice({ ...newInvoice, guestName: e.target.value })}
            >
              <option value="">Select Guest</option>
              {guests.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Amount</label>
            <input 
              type="number" 
              required 
              className="input-field" 
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Method</label>
            <select 
              className="input-field"
              value={newInvoice.method}
              onChange={(e) => setNewInvoice({ ...newInvoice, method: e.target.value })}
            >
              <option>Credit Card</option>
              <option>Digital Wallet</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Generate Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;
