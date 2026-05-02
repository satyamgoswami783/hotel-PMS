import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Hotel, 
  Bell, 
  Shield, 
  Globe, 
  Database,
  ChevronRight,
  CreditCard,
  Lock,
  List,
  Layers,
  Save,
  Trash2,
  Plus,
  Mail,
  Smartphone,
  Info,
  Key,
  Download,
  Terminal,
  Cpu,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { Card, Button, Badge, Modal, Drawer } from '../components/common/UI';
import { useApp, ROLES } from '../context/AppContext';
import { cn } from '../utils/cn';

const Settings = () => {
  const { addToast, role, platformSettings, updatePlatformSettings } = useApp();
  const [activeTab, setActiveTab] = useState('Platform Settings');
  const [platformData, setPlatformData] = useState(platformSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data for Roles Management
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', permissions: ['Full Access', 'Global Control'], users: 2 },
    { id: 2, name: 'Hotel Admin', permissions: ['Property Management', 'Billing'], users: 45 },
    { id: 3, name: 'Support Agent', permissions: ['View Only', 'Tickets'], users: 12 },
  ]);

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  const tabs = isSuperAdmin ? [
    { title: 'Platform Settings', icon: SettingsIcon },
    { title: 'Global Configuration', icon: Globe },
    { title: 'User & Role Management', icon: User },
    { title: 'Billing & Subscription Settings', icon: CreditCard },
    { title: 'Notification Rules', icon: Bell },
    { title: 'Security & Access Control', icon: Shield },
    { title: 'System Logs & Monitoring', icon: List },
    { title: 'Integrations', icon: Layers },
  ] : [
    { title: 'Profile Settings', icon: User },
    { title: 'Hotel Configuration', icon: Hotel },
    { title: 'Notifications', icon: Bell },
    { title: 'Security & Privacy', icon: Shield },
    { title: 'Regional & Language', icon: Globe },
    { title: 'Data & Integrations', icon: Database },
  ];

  const handleSave = (e) => {
    if (e) e.preventDefault();
    addToast(`${activeTab} saved successfully!`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Platform Settings':
        return (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Platform Name</label>
                <input type="text" className="input-field" value={platformData.name} onChange={e => setPlatformData({...platformData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">System ID</label>
                <input type="text" className="input-field bg-slate-50 font-mono text-xs" value="ROOT-X-99-ALPHA" readOnly />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Platform Description</label>
              <textarea className="input-field h-24 pt-3" placeholder="Describe the SaaS platform purpose..." defaultValue="Intelligent Auto-Pilot Hotel Management System. Multi-tenant SaaS architecture for global hospitality." />
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
              <Button variant="secondary" type="button">Discard</Button>
              <Button type="submit" className="gap-2"><Save size={16} /> Save Changes</Button>
            </div>
          </form>
        );

      case 'Global Configuration':
        return (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Default Currency</label>
                <select className="input-field" defaultValue="USD">
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">System Timezone</label>
                <select className="input-field" defaultValue="UTC">
                  <option value="UTC">UTC (GMT+0:00)</option>
                  <option value="EST">EST (GMT-5:00)</option>
                  <option value="IST">IST (GMT+5:30)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Default Language</label>
              <select className="input-field" defaultValue="EN">
                <option value="EN">English (US)</option>
                <option value="ES">Spanish</option>
                <option value="FR">French</option>
              </select>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
              <Button type="submit">Update Global Settings</Button>
            </div>
          </form>
        );

      case 'User & Role Management':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Access Control Roles</h3>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-9 text-xs"><Plus size={16} /> Create Role</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-slate-50/50">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Role Name</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Permissions</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">{r.name}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {r.permissions.map(p => <Badge key={p} variant="slate" className="text-[9px]">{p}</Badge>)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><ChevronRight size={16} /></button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Billing & Subscription Settings':
        return (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Default Trial Plan</label>
                <select className="input-field" defaultValue="Trial">
                  <option>Trial</option>
                  <option>Basic</option>
                  <option>Pro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Trial Period (Days)</label>
                <input type="number" className="input-field" defaultValue="14" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tax Percentage (%)</label>
                <input type="number" className="input-field" defaultValue="18" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Grace Period (Days)</label>
                <input type="number" className="input-field" defaultValue="7" />
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <Button type="submit">Update Billing Rules</Button>
            </div>
          </form>
        );

      case 'Notification Rules':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Global Email Notifications', icon: Mail, status: true },
                { label: 'Critical SMS Alerts', icon: Smartphone, status: false },
                { label: 'System Webhook Triggers', icon: Terminal, status: true },
                { label: 'Daily Admin Digests', icon: Info, status: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                    item.status ? "bg-primary-600" : "bg-slate-300"
                  )}>
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full transition-transform",
                      item.status ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => addToast('Notification preferences updated!')}>Save Rules</Button>
            </div>
          </div>
        );

      case 'Security & Access Control':
        return (
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Min Password Length</label>
                <input type="number" className="input-field" defaultValue="12" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Session Timeout (Mins)</label>
                <input type="number" className="input-field" defaultValue="60" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium">Require 2FA for Admins</span>
                <Badge variant="primary">Required</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium">Auto-lock inactive sessions</span>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
              <Button variant="secondary" className="gap-2"><Key size={16} /> Update Keys</Button>
              <Button type="submit">Save Security Policy</Button>
            </div>
          </form>
        );

      case 'System Logs & Monitoring':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" className="input-field pl-10 h-10" placeholder="Search logs..." />
              </div>
              <Button variant="secondary" className="h-10 text-xs gap-2"><RefreshCw size={14} /> Refresh</Button>
              <Button variant="secondary" className="h-10 text-xs gap-2"><Download size={14} /> Export</Button>
            </div>
            <div className="space-y-3">
              {[
                { event: 'New Hotel Onboarded', user: 'admin@pilot.com', time: '2 mins ago', type: 'info' },
                { event: 'Billing Webhook Error', user: 'SYSTEM', time: '1 hour ago', type: 'error' },
                { event: 'Password Policy Updated', user: 'root_user', time: '4 hours ago', type: 'warning' },
                { event: 'Subscription Upgrade', user: 'hotel_manager', time: '12 hours ago', type: 'success' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      log.type === 'error' ? 'bg-rose-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-primary-500'
                    )} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{log.event}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Integrations':
        return (
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: 'Stripe', desc: 'Global payments & billing', status: 'Connected', icon: CreditCard },
              { name: 'SendGrid', desc: 'Transactional email service', status: 'Disconnected', icon: Mail },
              { name: 'Twilio', desc: 'SMS & Voice gateway', status: 'Connected', icon: Smartphone },
              { name: 'AWS S3', desc: 'Object storage & backups', status: 'Connected', icon: Database },
            ].map(int => (
              <Card key={int.name} className="border border-slate-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                    <int.icon size={24} />
                  </div>
                  <Badge variant={int.status === 'Connected' ? 'success' : 'slate'}>{int.status}</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{int.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{int.desc}</p>
                <Button variant="ghost" className="w-full mt-4 h-9 text-xs border border-slate-100">Configure</Button>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {isSuperAdmin ? 'Platform Root Settings' : 'System Settings'}
        </h1>
        <p className="text-slate-500 mt-1">Configure global parameters and platform-wide rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="p-2 h-fit">
            <div className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button 
                  key={tab.title} 
                  onClick={() => setActiveTab(tab.title)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-all group text-left",
                    activeTab === tab.title ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={18} className={cn(
                      activeTab === tab.title ? "text-white" : "text-slate-400 group-hover:text-primary-600"
                    )} />
                    <span className="text-xs font-bold tracking-tight">{tab.title}</span>
                  </div>
                  <ChevronRight size={14} className={cn(
                    "transition-transform",
                    activeTab === tab.title ? "text-white rotate-90" : "text-slate-300 group-hover:text-slate-500"
                  )} />
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title={activeTab} subtitle={`Global configuration for ${activeTab.toLowerCase()}`}>
            {renderContent()}
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Access Role">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Role Name</label>
            <input type="text" className="input-field" placeholder="e.g. Moderator" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Permissions</label>
            {['Manage Hotels', 'Manage Users', 'Billing Access', 'Analytics Access'].map(p => (
              <div key={p} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center bg-white group-hover:border-primary-500">
                  <Check size={14} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={() => {
              addToast('New role created and pending assignment.');
              setIsModalOpen(false);
            }}>Create Role</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
