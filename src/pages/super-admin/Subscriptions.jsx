import React, { useState } from 'react';
import { CreditCard, Zap, Shield, Users, ArrowUpRight, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, Badge, Button, Modal } from '../../components/common/UI';
import { useApp } from '../../context/AppContext';

const Subscriptions = () => {
  const { subscriptions, addSubscription, deleteSubscription, updateSubscription, addToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', features: '', duration: 'Monthly' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.features) {
      addToast('Please fill in all plan details.', 'error');
      return;
    }

    const planData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim())
    };

    if (editingPlan) {
      updateSubscription(editingPlan.id, planData);
    } else {
      addSubscription(planData);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setFormData({ name: '', price: '', features: '', duration: 'Monthly' });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      features: plan.features.join(', '),
      duration: plan.duration
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Subscriptions</h1>
          <p className="text-slate-500 mt-1">Manage plans, pricing, and global billing records.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} /> Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptions.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden group border-2 hover:border-primary-200 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
              {plan.name === 'Enterprise' && (
                <Badge variant="primary">Popular</Badge>
              )}
              <button 
                onClick={() => deleteSubscription(plan.id)}
                className="p-1.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 border border-slate-100 shadow-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800">{plan.name}</h3>
                <p className="text-4xl font-black text-primary-600 mt-2">${plan.price}<span className="text-sm text-slate-400 font-bold">/{plan.duration === 'Monthly' ? 'mo' : 'yr'}</span></p>
              </div>
              <div className="h-[1px] bg-slate-100"></div>
              <ul className="space-y-3">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" onClick={() => handleEdit(plan)} className="w-full gap-2">
                <Edit2 size={16} /> Edit Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Global Billing History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3].map(i => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">#PAY-2026-08{i}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">Grand AutoPilot Resort</td>
                  <td className="px-6 py-4 text-sm text-slate-500">May 0{i}, 2026</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">$199.00</td>
                  <td className="px-6 py-4"><Badge variant="success">Paid</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingPlan ? "Edit Subscription Plan" : "Create New Plan"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingPlan ? "Save Changes" : "Create Plan"}</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Plan Name</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Professional" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Price (USD)</label>
              <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Billing Cycle</label>
              <select className="input-field" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Features (Comma separated)</label>
            <textarea 
              className="input-field h-24 pt-3" 
              value={formData.features} 
              onChange={e => setFormData({...formData, features: e.target.value})} 
              placeholder="e.g. 100 Rooms, AI Support, Advanced Reports"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subscriptions;
