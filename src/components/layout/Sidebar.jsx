import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserSquare2, 
  Brush, 
  CreditCard, 
  Users, 
  Cpu, 
  BarChart3, 
  Settings,
  Hotel,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const hotelNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.HOUSEKEEPING] },
  { name: 'Reservations', icon: CalendarDays, path: '/reservations', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK] },
  { name: 'Front Office', icon: UserSquare2, path: '/front-office', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK] },
  { name: 'Housekeeping', icon: Brush, path: '/housekeeping', roles: [ROLES.HOTEL_ADMIN, ROLES.HOUSEKEEPING] },
  { name: 'Billing & Payments', icon: CreditCard, path: '/billing', roles: [ROLES.HOTEL_ADMIN] },
  { name: 'Guest Management', icon: Users, path: '/guests', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK] },
  { name: 'Automation Center', icon: Cpu, path: '/automation', roles: [ROLES.HOTEL_ADMIN] },
  { name: 'Analytics', icon: BarChart3, path: '/analytics', roles: [ROLES.HOTEL_ADMIN] },
  { name: 'Settings', icon: Settings, path: '/settings', roles: [ROLES.HOTEL_ADMIN] },
];

const superAdminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Hotels Management', icon: Building2, path: '/hotels', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Subscriptions', icon: CreditCard, path: '/subscriptions', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Platform Users', icon: Users, path: '/platform-users', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Global Analytics', icon: BarChart3, path: '/analytics', roles: [ROLES.SUPER_ADMIN] },
  { name: 'System Settings', icon: Settings, path: '/settings', roles: [ROLES.SUPER_ADMIN] },
];

export const Sidebar = () => {
  const { role } = useApp();

  const navigation = role === ROLES.SUPER_ADMIN ? superAdminNav : hotelNav;
  const filteredNavigation = navigation.filter(item => item.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <Hotel size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight">AutoPilot</span>
          <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            {role === ROLES.SUPER_ADMIN ? 'SaaS Platform' : 'Hotel Systems'}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary-50 text-primary-700 font-semibold shadow-sm shadow-primary-100" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              "group-hover:scale-110 duration-200"
            )} />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <ShieldCheck size={60} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-medium text-slate-400 mb-1">ENTERPRISE</p>
            <h4 className="font-bold text-sm mb-3 text-white">
              {role === ROLES.SUPER_ADMIN ? 'Platform Root' : 'Grand Resort'}
            </h4>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-primary-500 h-1.5 rounded-full w-4/5 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
            </div>
            <p className="text-[10px] text-slate-400">Security: Optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
