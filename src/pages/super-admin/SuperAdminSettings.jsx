import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  CreditCard, 
  Activity,
  Save
} from 'lucide-react';
import { Card, Button } from '../../components/common/UI';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const SuperAdminSettings = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('Platform Config');
  const [selectedRole, setSelectedRole] = useState('Hotel Admin');
  const [isMaintenance, setIsMaintenance] = useState(false);

  const modulesList = [
    'Dashboard', 'Hotels Management', 'Platform Users', 'Subscriptions', 
    'Global Analytics', 'Reservations', 'Front Office', 'Housekeeping', 
    'Billing & Payments', 'Guest Management', 'Automation Center', 'Settings'
  ];

  const defaultModulePerms = { view: false, create: false, edit: false, delete: false };
  const allPerms = { view: true, create: true, edit: true, delete: true };
  const viewOnly = { view: true, create: false, edit: false, delete: false };

  const [permissions, setPermissions] = useState({
    'Super Admin': modulesList.reduce((acc, mod) => ({ ...acc, [mod]: { ...allPerms } }), {}),
    'Hotel Admin': {
      'Dashboard': { ...allPerms }, 'Hotels Management': { ...defaultModulePerms }, 'Platform Users': { ...defaultModulePerms },
      'Subscriptions': { ...defaultModulePerms }, 'Global Analytics': { ...defaultModulePerms }, 'Reservations': { ...allPerms },
      'Front Office': { ...allPerms }, 'Housekeeping': { ...allPerms }, 'Billing & Payments': { ...allPerms },
      'Guest Management': { ...allPerms }, 'Automation Center': { ...allPerms }, 'Settings': { ...allPerms }
    },
    'Front Desk': {
      'Dashboard': { ...viewOnly }, 'Hotels Management': { ...defaultModulePerms }, 'Platform Users': { ...defaultModulePerms },
      'Subscriptions': { ...defaultModulePerms }, 'Global Analytics': { ...defaultModulePerms }, 'Reservations': { ...allPerms },
      'Front Office': { ...allPerms }, 'Housekeeping': { ...defaultModulePerms }, 'Billing & Payments': { ...viewOnly },
      'Guest Management': { ...allPerms }, 'Automation Center': { ...defaultModulePerms }, 'Settings': { ...defaultModulePerms }
    },
    'Housekeeping': {
      'Dashboard': { ...viewOnly }, 'Hotels Management': { ...defaultModulePerms }, 'Platform Users': { ...defaultModulePerms },
      'Subscriptions': { ...defaultModulePerms }, 'Global Analytics': { ...defaultModulePerms }, 'Reservations': { ...defaultModulePerms },
      'Front Office': { ...defaultModulePerms }, 'Housekeeping': { ...allPerms }, 'Billing & Payments': { ...defaultModulePerms },
      'Guest Management': { ...defaultModulePerms }, 'Automation Center': { ...defaultModulePerms }, 'Settings': { ...defaultModulePerms }
    }
  });

  const handlePermissionChange = (module, action) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [module]: {
          ...prev[selectedRole][module],
          [action]: !prev[selectedRole][module][action]
        }
      }
    }));
  };

  const handleSavePermissions = () => {
    console.log("Updated Permissions Object:", permissions);
    addToast("Permissions updated successfully", "success");
  };

  const tabs = [
    { title: 'Platform Config', icon: SettingsIcon, desc: 'Global platform settings' },
    { title: 'Role & Access Control', icon: ShieldCheck, desc: 'Manage role-based permissions' },
    { title: 'Activity History', icon: Activity, desc: 'Recent system activities' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    addToast(`${activeTab} updated successfully!`, 'success');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Platform Config':
        return (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Platform Name</label>
                <input type="text" className="input-field h-12" defaultValue="AutoPilot SaaS Platform" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Default Currency</label>
                <select className="input-field h-12" defaultValue="USD">
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Timezone</label>
                <select className="input-field h-12" defaultValue="UTC">
                  <option value="UTC">UTC (Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Support Email</label>
                <input type="email" className="input-field h-12" defaultValue="support@autopilot.com" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Platform Status</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Enable maintenance mode to restrict access</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsMaintenance(!isMaintenance)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors relative",
                    isMaintenance ? "bg-amber-500" : "bg-emerald-500"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all shadow-sm absolute top-1",
                    isMaintenance ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="gap-2 px-8 h-12"><Save size={16} /> Save Config</Button>
            </div>
          </form>
        );
      
      case 'Role & Access Control':
        return (
          <div className="space-y-6">
            <p className="text-sm text-slate-500 font-medium mb-6">Manage role-based permissions for platform users</p>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT PANEL: Roles List */}
              <div className="lg:w-1/3 flex flex-col gap-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Role</h3>
                {['Super Admin', 'Hotel Admin', 'Front Desk', 'Housekeeping'].map((r) => (
                  <button 
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                      selectedRole === r 
                        ? "bg-primary-50 border-primary-200 text-primary-900 shadow-sm" 
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <span className="font-bold text-sm">{r}</span>
                    {selectedRole === r && <div className="w-2 h-2 rounded-full bg-primary-600"></div>}
                  </button>
                ))}
              </div>

              {/* RIGHT PANEL: Permissions Table */}
              <div className="lg:w-2/3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                  <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
                    <h3 className="font-bold text-slate-800">Permissions for {selectedRole}</h3>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                        <tr>
                          <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                          <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">View</th>
                          <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Create</th>
                          <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Edit</th>
                          <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {modulesList.map(module => {
                          const perms = permissions[selectedRole]?.[module] || defaultModulePerms;
                          const isHidden = !perms.view;
                          return (
                            <tr key={module} className={cn("hover:bg-slate-50 transition-colors", isHidden ? "opacity-50 grayscale bg-slate-50/50" : "")}>
                              <td className="py-3 px-4 text-sm font-bold text-slate-700">{module}</td>
                              {['view', 'create', 'edit', 'delete'].map(action => (
                                <td key={action} className="py-3 px-2 text-center">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={perms[action]}
                                      onChange={() => handlePermissionChange(module, action)}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                                  </label>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button onClick={handleSavePermissions} className="gap-2 px-8 h-12">
                    <Save size={16} /> Save Permissions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Activity History':
        const logs = [
          { id: 1, type: 'info', message: 'Super Admin logged in', info: 'Platform Access', time: '10 mins ago' },
          { id: 2, type: 'warning', message: 'Failed login attempt', info: 'IP: 192.168.1.45', time: '2 hrs ago' },
          { id: 3, type: 'success', message: 'New hotel registered', info: 'Hotel: Grand View', time: '5 hrs ago' },
          { id: 4, type: 'success', message: 'Subscription payment completed', info: 'Hotel ID: #882', time: '1 day ago' },
          { id: 5, type: 'info', message: 'Platform config updated', info: 'Currency changed', time: '2 days ago' },
        ];
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 font-medium mb-4">Recent platform activities and audit trail.</p>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      log.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                      log.type === 'warning' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{log.message}</p>
                      <p className="text-[10px] font-bold text-slate-400">{log.info}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Manage global platform configurations and administration.</p>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden flex flex-nowrap overflow-x-auto gap-2 pb-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button 
            key={tab.title} 
            onClick={() => setActiveTab(tab.title)}
            className={cn(
              "px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              activeTab === tab.title ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-400"
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.title} 
              onClick={() => setActiveTab(tab.title)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group border-2",
                activeTab === tab.title 
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                activeTab === tab.title ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
              )}>
                <tab.icon size={20} />
              </div>
              <div>
                <p className={cn("text-sm font-black", activeTab === tab.title ? "text-white" : "text-slate-700")}>{tab.title}</p>
                <p className={cn("text-[10px] font-bold mt-0.5", activeTab === tab.title ? "text-slate-400" : "text-slate-400")}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8 border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl bg-white">
            <div className="mb-8 border-b border-slate-100 pb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                {React.createElement(tabs.find(t => t.title === activeTab)?.icon || SettingsIcon, { size: 24 })}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
                <p className="text-xs font-bold text-slate-400 mt-1">{tabs.find(t => t.title === activeTab)?.desc}</p>
              </div>
            </div>
            
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
