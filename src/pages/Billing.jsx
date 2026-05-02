import React from 'react';
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
import { Card, Badge, Button } from '../components/common/UI';
import { cn } from '../utils/cn';

const Billing = () => {
  const invoices = [
    { id: 'INV-2026-001', guest: 'John Doe', room: '101', amount: 600, status: 'paid', date: '2026-05-01' },
    { id: 'INV-2026-002', guest: 'Jane Smith', room: '103', amount: 450, status: 'pending', date: '2026-05-02' },
    { id: 'INV-2026-003', guest: 'Robert Brown', room: '203', amount: 300, status: 'overdue', date: '2026-04-28' },
    { id: 'INV-2026-004', guest: 'Alice Wilson', room: '302', amount: 1200, status: 'paid', date: '2026-04-25' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Payments</h1>
          <p className="text-slate-500 mt-1">Track invoices, payments, and financial records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><Download size={18} /> Export CSV</Button>
          <Button className="gap-2"><CreditCard size={18} /> Terminal Sync</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Find invoice or guest..."
                className="input-field pl-10 h-10" 
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="slate">All</Badge>
              <Badge variant="success" className="bg-transparent opacity-50">Paid</Badge>
              <Badge variant="warning" className="bg-transparent opacity-50">Pending</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest & Room</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{inv.id}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{inv.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{inv.guest}</span>
                        <span className="text-xs text-slate-500">Room {inv.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">${inv.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'error' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" className="p-1.5 h-auto"><Send size={14} /></Button>
                        <Button variant="secondary" className="p-1.5 h-auto"><Download size={14} /></Button>
                        <Button variant="secondary" className="p-1.5 h-auto"><MoreHorizontal size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Quick Statistics">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Revenue (MTD)</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-black text-slate-900">$142,500</h3>
                  <span className="text-xs text-emerald-600 font-bold">+12.4%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase">Pending Payments</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-black text-amber-600">$12,840</h3>
                  <span className="text-xs text-slate-400 font-bold">14 Invoices</span>
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
    </div>
  );
};

export default Billing;
