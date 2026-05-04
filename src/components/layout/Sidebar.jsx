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
  Building2,
  LogOut
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const hotelNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.HOUSEKEEPING, ROLES.MANAGER, ROLES.STAFF] },
  { name: 'Reservations', icon: CalendarDays, path: '/reservations', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.MANAGER] },
  { name: 'Front Office', icon: UserSquare2, path: '/front-office', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.MANAGER] },
  { name: 'Housekeeping', icon: Brush, path: '/housekeeping', roles: [ROLES.HOTEL_ADMIN, ROLES.HOUSEKEEPING, ROLES.MANAGER] },
  { name: 'Billing & Payments', icon: CreditCard, path: '/billing', roles: [ROLES.HOTEL_ADMIN, ROLES.MANAGER] },
  { name: 'Guest Management', icon: Users, path: '/guests', roles: [ROLES.HOTEL_ADMIN, ROLES.FRONT_DESK, ROLES.MANAGER] },
  { name: 'Automation Center', icon: Cpu, path: '/automation', roles: [ROLES.HOTEL_ADMIN] },
  { name: 'Analytics', icon: BarChart3, path: '/analytics', roles: [ROLES.HOTEL_ADMIN, ROLES.MANAGER] },
  { name: 'Settings', icon: Settings, path: '/settings', roles: [ROLES.HOTEL_ADMIN] },
];

const superAdminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Hotels Management', icon: Building2, path: '/hotels', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Subscriptions', icon: CreditCard, path: '/subscriptions', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Platform Users', icon: Users, path: '/platform-users', roles: [ROLES.SUPER_ADMIN] },
  { name: 'Global Analytics', icon: BarChart3, path: '/analytics', roles: [ROLES.SUPER_ADMIN] },
  { name: 'System Settings', icon: Settings, path: '/system-settings', roles: [ROLES.SUPER_ADMIN] },
];

export const Sidebar = () => {
  const { role, isSidebarOpen, toggleSidebar, setIsAuthenticated, rolePermissions } = useApp();

  const navigation = role === ROLES.SUPER_ADMIN ? superAdminNav : hotelNav;
  
  // Role-based filtering + Permission-based filtering
  const filteredNavigation = navigation.filter(item => {
    // Check if role is allowed to see this item (existing logic)
    const isRoleAllowed = item.roles.includes(role);
    if (!isRoleAllowed) return false;

    // Check custom permissions from AppContext
    const permissions = rolePermissions[role] || {};
    
    // Map sidebar names to permissions module names
    const nameMapping = {
      'Billing & Payments': 'Billing & Invoices',
      'Guest Management': 'Guest Experience',
      'Analytics': 'Analytics & Reports',
      'Global Analytics': 'Analytics & Reports',
      'System Settings': 'Settings'
    };

    const moduleName = nameMapping[item.name] || item.name;
    const canView = permissions[moduleName]?.view ?? true; // Default to true if not found

    return canView;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div className={cn(
        "flex flex-col h-full bg-white border-r border-slate-200 w-64 fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
            onClick={() => { if (window.innerWidth < 1024 && isSidebarOpen) toggleSidebar(); }}
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

      <div className="p-4 mt-auto border-t border-slate-100">
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
      </div>
    </>
  );
};
