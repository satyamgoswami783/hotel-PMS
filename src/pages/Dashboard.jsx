import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DoorOpen, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  DollarSign,
  Activity,
  Hotel
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp, ROLES } from '../context/AppContext';
import { Card, Badge, Button, Modal, Drawer } from '../components/common/UI';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 18 },
  { name: 'Wed', revenue: 5000, bookings: 32 },
  { name: 'Thu', revenue: 4500, bookings: 28 },
  { name: 'Fri', revenue: 6000, bookings: 40 },
  { name: 'Sat', revenue: 7000, bookings: 48 },
  { name: 'Sun', revenue: 5500, bookings: 35 },
];

const KPICard = ({ title, value, trend, trendValue, icon: Icon, color, onClick }) => (
  <Card className="relative overflow-hidden group cursor-pointer" onClick={onClick}>
    <div className={cn(
      "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-125",
      color
    )}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl text-white shadow-lg", color)}>
        <Icon size={24} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
        trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h2 className="text-3xl font-bold text-slate-800 mt-1">{value}</h2>
  </Card>
);

const Dashboard = () => {
  const { rooms, role, hotels, addToast, systemEvents, addBooking, guests } = useApp();
  const navigate = useNavigate();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    guestName: '',
    room: '',
    checkIn: '',
    checkOut: '',
    amount: 150
  });

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  const handleGenerateAudit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsAuditModalOpen(false);
      addToast('Platform Audit Report generated and downloaded successfully!');
    }, 2000);
  };

  const handleDownloadReport = () => {
    addToast('Generating Executive Report...');
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Value\n"
        + `Occupancy Rate,${occupancyRate}%\n`
        + "Revenue Today,$12450\n"
        + "Check-ins,8\n"
        + "Check-outs,5";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "hotel_report.csv");
      document.body.appendChild(link);
      link.click();
      addToast('Executive Report downloaded!');
    }, 1500);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const success = addBooking(newBooking);
    if (success) {
      setIsBookingModalOpen(false);
      setNewBooking({ guestName: '', room: '', checkIn: '', checkOut: '', amount: 150 });
    }
  };

  const occupancyRate = Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100);
  
  if (isSuperAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Control Tower</h1>
            <p className="text-slate-500 mt-1">Global performance metrics for AutoPilot SaaS.</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsAuditModalOpen(true)}>Download Platform Audit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total Hotels" value={hotels.length} trend="up" trendValue="2" icon={Building2} color="bg-primary-600" onClick={() => navigate('/hotels')} />
          <KPICard title="Platform Revenue" value="$42,500" trend="up" trendValue="15%" icon={DollarSign} color="bg-indigo-600" onClick={() => navigate('/analytics')} />
          <KPICard title="Active Subscriptions" value="84" trend="up" trendValue="4%" icon={Users} color="bg-emerald-600" onClick={() => navigate('/subscriptions')} />
          <KPICard title="System Uptime" value="99.9%" trend="up" trendValue="0.1%" icon={Activity} color="bg-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="Global Revenue Growth" className="lg:col-span-2">
            <div className="h-[350px] w-full mt-4 relative">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card title="Recent Property Onboarding">
            <div className="space-y-6">
              {hotels.map(h => (
                <div key={h.id} onClick={() => setSelectedHotel(h)} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                    <Hotel size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{h.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{h.location}</p>
                  </div>
                  <Badge variant="success" className="ml-auto">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Generate Platform Audit">
          <div className="space-y-6">
            <p className="text-sm text-slate-500 font-medium">Configure audit report parameters for platform-wide financial and operational data.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Date Range</label>
                <select className="input-field">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Export Format</label>
                <select className="input-field">
                  <option>PDF Document</option>
                  <option>CSV Spreadsheet</option>
                  <option>Excel Worksheet</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setIsAuditModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleGenerateAudit} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Modal>

        <Drawer 
          isOpen={!!selectedHotel} 
          onClose={() => setSelectedHotel(null)} 
          title={selectedHotel?.name}
          subtitle={`Property ID: ${selectedHotel?.id}`}
        >
          {selectedHotel && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-50 border-0 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedHotel.admin}</p>
                </Card>
                <Card className="bg-slate-50 border-0 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan</p>
                  <Badge variant="primary" className="mt-1">{selectedHotel.plan}</Badge>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance Snapshot</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-500">Monthly Revenue</span>
                    <span className="text-sm font-bold text-slate-800">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-500">Active Bookings</span>
                    <span className="text-sm font-bold text-slate-800">142</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-500">Staff Count</span>
                    <span className="text-sm font-bold text-slate-800">12</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => navigate('/hotels')}>View Settings</Button>
                <Button className="flex-1">Contact Admin</Button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance metrics for Grand Resort.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={handleDownloadReport}>Download Report</Button>
          <Button className="w-full sm:w-auto" onClick={() => setIsBookingModalOpen(true)}>+ New Booking</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Occupancy Rate" value={`${occupancyRate}%`} trend="up" trendValue="12%" icon={TrendingUp} color="bg-primary-600" />
        <KPICard title="Revenue Today" value="$12,450" trend="up" trendValue="8.4%" icon={DollarSign} color="bg-indigo-600" />
        <KPICard title="Check-ins" value="8" trend="down" trendValue="2%" icon={DoorOpen} color="bg-emerald-600" />
        <KPICard title="Check-outs" value="5" trend="up" trendValue="15%" icon={CheckCircle2} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Revenue Trends" className="lg:col-span-2">
          <div className="h-[350px] w-full mt-4 relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card title="Operational Alerts" action={<Button variant="ghost" className="text-xs" onClick={() => navigate('/notifications')}>View All</Button>}>
          <div className="space-y-6">
            {systemEvents.length > 0 ? systemEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex gap-4 group cursor-pointer">
                <div className={cn(
                  "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center",
                  event.type === 'warning' ? "bg-rose-100 text-rose-600" : "bg-primary-100 text-primary-600"
                )}>
                  {event.type === 'warning' ? <AlertCircle size={20} /> : <Activity size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{event.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No active alerts</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Live Room Status">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className={cn(
              "p-4 rounded-xl border text-center transition-all cursor-pointer hover:ring-2 hover:ring-primary-500/20",
              room.status === 'occupied' ? "bg-white border-slate-200" : 
              room.status === 'maintenance' ? "bg-slate-50 border-slate-100" : "bg-emerald-50 border-emerald-100"
            )}>
              <p className="text-xs font-bold text-slate-400 mb-1">Room</p>
              <h4 className="text-lg font-black text-slate-800">{room.id}</h4>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full mx-auto mt-2",
                room.status === 'occupied' ? "bg-blue-500" : 
                room.status === 'maintenance' ? "bg-slate-400" : "bg-emerald-500"
              )}></div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="New Booking">
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Guest Name</label>
              <input 
                type="text" 
                required
                className="input-field" 
                value={newBooking.guestName}
                onChange={(e) => setNewBooking({...newBooking, guestName: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Room Number</label>
              <select 
                className="input-field"
                required
                value={newBooking.room}
                onChange={(e) => setNewBooking({...newBooking, room: e.target.value})}
              >
                <option value="">Select Room</option>
                {rooms.filter(r => r.status === 'vacant').map(r => (
                  <option key={r.id} value={r.id}>Room {r.id} ({r.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Status</label>
              <select 
                className="input-field"
                value={newBooking.paymentStatus}
                onChange={(e) => setNewBooking({...newBooking, paymentStatus: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Check-In</label>
              <input 
                type="date" 
                required
                className="input-field" 
                value={newBooking.checkIn}
                onChange={(e) => setNewBooking({...newBooking, checkIn: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Check-Out</label>
              <input 
                type="date" 
                required
                className="input-field" 
                value={newBooking.checkOut}
                onChange={(e) => setNewBooking({...newBooking, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="secondary" className="flex-1 w-full" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 w-full">Create Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
