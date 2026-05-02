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
  const { addToast } = useApp();
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">Deep insights into your property's financial health.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <Button 
              variant="ghost" 
              className={cn("text-xs h-8 px-3", filter === 'Last 7 Days' && "bg-slate-50 font-bold text-slate-900")}
              onClick={() => setFilter('Last 7 Days')}
            >Last 7 Days</Button>
            <Button 
              variant="ghost" 
              className={cn("text-xs h-8 px-3", filter === '30 Days' && "bg-slate-50 font-bold text-slate-900")}
              onClick={() => setFilter('30 Days')}
            >Last 30 Days</Button>
            <Button variant="ghost" className="text-xs h-8 px-3">YTD</Button>
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
          <h2 className="text-3xl font-black mt-1">$324,500</h2>
          <div className="flex items-center gap-1 text-xs text-primary-200 mt-4">
            <TrendingUp size={14} /> +18.4% from last period
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Avg. Daily Rate</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">$185.00</h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-4 font-bold">
            <TrendingUp size={14} /> +4.2%
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">RevPAR</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">$142.40</h2>
          <div className="flex items-center gap-1 text-xs text-rose-600 mt-4 font-bold">
            <TrendingUp size={14} className="rotate-180" /> -2.1%
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Guest Satisfaction</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">4.8/5.0</h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-4 font-bold">
            <TrendingUp size={14} /> +0.2
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Monthly Revenue Performance" subtitle="Revenue trends for the current fiscal year">
          <div className="h-[300px] min-h-[300px] mt-4">
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
          <div className="h-[300px] min-h-[300px] mt-4">
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
    </div>
  );
};

export default Analytics;
