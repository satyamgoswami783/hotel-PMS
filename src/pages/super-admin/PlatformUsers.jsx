import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, Mail, MoreVertical, Building2, UserCheck } from 'lucide-react';
import { Card, Badge, Button, Modal } from '../../components/common/UI';
import { useApp, ROLES } from '../../context/AppContext';

const PlatformUsers = () => {
  const { addToast, platformUsers, addPlatformUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', property: '' });
  
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendInvitation = () => {
    if (!formData.name || !formData.email || !formData.property) {
      addToast('Please fill in all fields before sending the invitation.', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    
    addPlatformUser(formData);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', property: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Users</h1>
          <p className="text-slate-500 mt-1">Manage hotel administrators and platform-level staff.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <UserPlus size={18} /> Invite Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-600 text-white border-0 shadow-lg shadow-primary-500/20">
          <p className="text-primary-200 text-[10px] font-bold uppercase tracking-widest">Total Admins</p>
          <h2 className="text-3xl font-black mt-1">{platformUsers.length}</h2>
          <p className="mt-4 text-xs text-primary-200 flex items-center gap-1">
            <UserCheck size={14} /> 100% active this month
          </p>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">New Requests</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">1</h2>
          <p className="mt-4 text-xs text-amber-600 font-bold uppercase tracking-tight">Pending Approval</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">System Health</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">Optimal</h2>
          <p className="mt-4 text-xs text-emerald-600 font-bold uppercase tracking-tight">Access Control Stable</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-sm:max-w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name or email..." className="input-field pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {platformUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                          <Mail size={10} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">{user.property}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite New Administrator">
        <div className="space-y-6">
          <p className="text-sm text-slate-500">Invite a hotel owner or manager to manage their property on the AutoPilot platform.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="john@hotel.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned Property</label>
              <select 
                className="input-field"
                value={formData.property}
                onChange={e => setFormData({...formData, property: e.target.value})}
              >
                <option value="">Select a property...</option>
                <option value="Grand AutoPilot Resort">Grand AutoPilot Resort</option>
                <option value="Azure Bay Hotel">Azure Bay Hotel</option>
                <option value="Urban Peak Suites">Urban Peak Suites</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSendInvitation}>Send Invitation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlatformUsers;
