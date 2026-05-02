import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { role, setRole, notifications, markNotificationRead, setIsAuthenticated, hotels, platformUsers } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.length > 1 ? [
    ...hotels.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map(h => ({ ...h, type: 'Hotel' })),
    ...platformUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => ({ ...u, type: 'User' }))
  ].slice(0, 5) : [];

  const getRoleBadge = (currentRole) => {
    switch (currentRole) {
      case ROLES.SUPER_ADMIN: return 'bg-purple-100 text-purple-700';
      case ROLES.HOTEL_ADMIN: return 'bg-blue-100 text-blue-700';
      case ROLES.FRONT_DESK: return 'bg-emerald-100 text-emerald-700';
      case ROLES.HOUSEKEEPING: return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleLabel = (currentRole) => {
    return currentRole.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-30 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Quick search (Hotel, User)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {searchResults.map((res, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0" onClick={() => setSearchQuery('')}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{res.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{res.type}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500">{res.type === 'Hotel' ? res.location : res.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all group"
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button className="text-xs text-primary-600 font-semibold hover:underline">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} onClick={() => markNotificationRead(n.id)} className={cn(
                    "p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 border-b border-slate-50 last:border-0",
                    !n.read && "bg-primary-50/30"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    )}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-center">
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-900">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-primary-500/20">
              JD
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-slate-800 leading-none">John Doe</p>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block",
                getRoleBadge(role)
              )}>
                {getRoleLabel(role)}
              </span>
            </div>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", showProfile && "rotate-180")} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black text-lg">
                  JD
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">John Doe</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{getRoleLabel(role)}</p>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <User size={16} /> Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <SettingsIcon size={16} /> Preferences
                </button>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
