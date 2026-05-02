import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  DollarSign, 
  Hotel 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/common/UI';
import { cn } from '../utils/cn';

const data = [
  { name: 'Jan', rev: 40000, occ: 65 },
  { name: 'Feb', rev: 45000, occ: 68 },
  { name: 'Mar', rev: 52000, occ: 72 },
  { name: 'Apr', rev: 48000, occ: 70 },
  { name: 'May', rev: 61000, occ: 82 },
  { name: 'Jun', rev: 75000, occ: 90 },
];

const Analytics = () => {
  const { addToast, invoices, bookings, guests } = useApp();
  const [filter, setFilter] = useState('30 Days');
  const [isExporting, setIsExporting] = useState(false);
  
  const getChartData = () => {
    if (filter === 'Last 7 Days') return [
      { name: 'Mon', rev: 12000, occ: 60 },
      { name: 'Tue', rev: 15000, occ: 65 },
      { name: 'Wed', rev: 18000, occ: 70 },
      { name: 'Thu', rev: 14000, occ: 62 },
      { name: 'Fri', rev: 22000, occ: 85 },
      { name: 'Sat', rev: 28000, occ: 95 },
      { name: 'Sun', rev: 25000, occ: 90 },
    ];
    return [
      { name: 'Jan', rev: 40000, occ: 65 },
      { name: 'Feb', rev: 45000, occ: 68 },
      { name: 'Mar', rev: 52000, occ: 72 },
      { name: 'Apr', rev: 48000, occ: 70 },
      { name: 'May', rev: 61000, occ: 82 },
      { name: 'Jun', rev: 75000, occ: 90 },
    ];
  };

  const chartData = getChartData();

  const handleExport = () => {
    setIsExporting(true);
    
    // Create CSV content
    const headers = ['Period', 'Revenue', 'Occupancy'];
    const rows = chartData.map(d => `${d.name},${d.rev},${d.occ}%`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + rows.join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform_analytics_${filter.replace(' ', '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    
    // Add fake delay for realism
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      addToast('Analytics report exported successfully!');
    }, 1500);
  };

  const totalRevenue = invoices.reduce((acc, inv) => inv.status === 'Paid' ? acc + inv.amount : acc, 0);
  const avgBookingVal = totalRevenue / (invoices.filter(i => i.status === 'Paid').length || 1);
  const occupancyRate = (bookings.filter(b => b.status === 'checked-in').length / 10) * 100; // Assuming 10 rooms total

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">Deep insights into your property's financial health.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {['Last 7 Days', '30 Days', 'YTD'].map(f => (
              <Button 
                key={f}
                variant="ghost" 
                className={cn("text-xs h-8 px-3", filter === f && "bg-slate-50 font-bold text-slate-900")}
                onClick={() => setFilter(f)}
              >{f}</Button>
            ))}
          </div>
          <Button 
            className="gap-2" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>Generating...</>
            ) : (
              <><Download size={18} /> Export Data</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-600 text-white border-0">
          <p className="text-primary-200 text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-black mt-1">${totalRevenue.toLocaleString()}</h2>
          <div className="flex items-center gap-1 text-xs text-primary-200 mt-4">
            <TrendingUp size={14} /> +18.4% from last period
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Avg. Booking Value</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">${avgBookingVal.toFixed(2)}</h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-4 font-bold">
            <TrendingUp size={14} /> +4.2%
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Occupancy Rate</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">{occupancyRate}%</h2>
          <div className="flex items-center gap-1 text-xs text-rose-600 mt-4 font-bold">
            <TrendingUp size={14} className="rotate-180" /> -2.1%
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Loyalty Guests</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">{guests.filter(g => g.status === 'VIP').length}</h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-4 font-bold">
            <TrendingUp size={14} /> +{guests.filter(g => g.status === 'VIP').length}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Monthly Revenue Performance" subtitle="Revenue trends for the current fiscal year">
          <div className="h-[300px] min-h-[300px] w-full mt-4" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="rev" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Occupancy Trends" subtitle="Property utilization percentage over time">
          <div className="h-[300px] min-h-[300px] w-full mt-4" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="occ" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Top Revenue Guests" subtitle="Guest profiles contributing most to your revenue">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Spent</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guests.sort((a, b) => (b.spent || 0) - (a.spent || 0)).slice(0, 5).map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {guest.name[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{guest.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">${(guest.spent || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={guest.status === 'VIP' ? 'primary' : 'slate'}>{guest.status}</Badge>
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

export default Analytics;
