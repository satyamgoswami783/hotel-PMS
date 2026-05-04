import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon, User, Bed, Calendar, Globe, Building, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, ROLES } from '../../context/AppContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { role, setRole, notifications, markNotificationRead, setIsAuthenticated, hotels, platformUsers, guests, rooms, bookings, otas, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfile(false));

  const rawQuery = searchQuery.toLowerCase().trim();

  const searchResults = rawQuery.length > 1 ? [
    ...(guests || []).filter(g => g.name.toLowerCase().includes(rawQuery) || (g.email && g.email.toLowerCase().includes(rawQuery)))
      .map(g => ({ id: `G-${g.id}`, name: g.name, subtext: g.email || 'No email', type: 'Guest', icon: User, path: '/guests' })),
    ...(rooms || []).filter(r => r.id.toString().toLowerCase().includes(rawQuery) || (r.type && r.type.toLowerCase().includes(rawQuery)))
      .map(r => ({ id: `R-${r.id}`, name: `Room ${r.id}`, subtext: r.type || 'Standard', type: 'Room', icon: Bed, path: '/front-office' })),
    ...(bookings || []).filter(b => b.id.toLowerCase().includes(rawQuery) || (b.guestName && b.guestName.toLowerCase().includes(rawQuery)))
      .map(b => ({ id: b.id, name: b.id, subtext: b.guestName || 'Unknown Guest', type: 'Booking', icon: Calendar, path: '/reservations' })),
    ...(otas || []).filter(o => o.name && o.name.toLowerCase().includes(rawQuery))
      .map(o => ({ id: o.id, name: o.name, subtext: `${o.commission || 0} Commission`, type: 'OTA', icon: Globe, path: '/analytics' })),
    ...(hotels || []).filter(h => h.name && h.name.toLowerCase().includes(rawQuery))
      .map(h => ({ id: h.id, name: h.name, subtext: h.location || 'Unknown Location', type: 'Hotel', icon: Building, path: '/hotels' })),
    ...(platformUsers || []).filter(u => u.name.toLowerCase().includes(rawQuery) || (u.email && u.email.toLowerCase().includes(rawQuery)))
      .map(u => ({ id: `U-${u.id}`, name: u.name, subtext: u.email || 'No email', type: 'User', icon: User, path: '/platform-users' }))
  ].slice(0, 6) : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.blur();
  };

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
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-3 animate-in slide-in-from-top-1 duration-200">
          <button 
            onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl"
          >
            <ChevronDown className="rotate-90" size={20} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 w-4 h-4" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-primary-200 ring-4 ring-primary-500/5 rounded-xl outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                <div className="p-1">
                  {searchResults.map((res, i) => {
                    const Icon = res.icon;
                    return (
                      <div 
                        key={res.id} 
                        className={cn(
                          "p-3 rounded-xl cursor-pointer flex justify-between items-center transition-colors",
                          selectedIndex === i ? "bg-primary-50" : "hover:bg-slate-50"
                        )} 
                        onClick={() => { handleSelectResult(res); setIsMobileSearchOpen(false); }}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            selectedIndex === i ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500"
                          )}>
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className={cn("text-sm font-bold", selectedIndex === i ? "text-primary-900" : "text-slate-800")}>{res.name}</span>
                            <span className="text-[10px] text-slate-500">{res.subtext}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 max-w-xl flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            {role !== ROLES.SUPER_ADMIN && (
              <div className="relative group flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search guests, rooms, bookings, OTAs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Top Results</span>
                    <span className="hidden md:inline-block">Use ↑↓ arrows to navigate, Enter to select</span>
                  </div>
                  <div className="p-1">
                    {searchResults.map((res, i) => {
                      const Icon = res.icon;
                      return (
                        <div 
                          key={res.id} 
                          className={cn(
                            "p-3 rounded-xl cursor-pointer flex justify-between items-center transition-colors",
                            selectedIndex === i ? "bg-primary-50" : "hover:bg-slate-50"
                          )} 
                          onClick={() => handleSelectResult(res)}
                          onMouseEnter={() => setSelectedIndex(i)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              selectedIndex === i ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500"
                            )}>
                              <Icon size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className={cn("text-sm font-bold", selectedIndex === i ? "text-primary-900" : "text-slate-800")}>{res.name}</span>
                              <span className="text-[10px] text-slate-500">{res.subtext}</span>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider",
                            selectedIndex === i ? "bg-white text-primary-600 shadow-sm" : "bg-slate-100 text-slate-400"
                          )}>
                            {res.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              </div>
            )}
            
            {/* Mobile Search Icon Only */}
            {role !== ROLES.SUPER_ADMIN && (
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="sm:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative" ref={notificationRef}>
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
                <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-80 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button className="text-xs text-primary-600 font-semibold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
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

            <div className="hidden sm:block h-8 w-[1px] bg-slate-200"></div>

            <div className="relative" ref={profileRef}>
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
                <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-64 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
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
                    <button 
                      onClick={() => { navigate('/settings'); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <SettingsIcon size={16} /> Settings
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
        </>
      )}
    </header>
  );
};
