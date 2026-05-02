import React from 'react';
import { Cpu, Zap, RefreshCcw, Bell, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button } from '../components/common/UI';
import { cn } from '../utils/cn';

const Automation = () => {
  const { isAutoPilot, toggleAutoPilot } = useApp();

  const features = [
    { id: 1, name: 'Smart Room Assignment', desc: 'Automatically assigns guests to the best available rooms based on priority and type.', icon: Cpu },
    { id: 2, name: 'Auto Housekeeping', desc: 'Generates cleaning tasks instantly upon guest check-out and marks rooms dirty.', icon: RefreshCcw },
    { id: 3, name: 'Billing Error Alerts', desc: 'Proactively detects pricing inconsistencies or missing charges before checkout.', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Automation Center</h1>
          <p className="text-slate-500 mt-1">Operational intelligence to streamline your hotel workflows.</p>
        </div>
        <div className={cn(
          "flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all duration-500",
          isAutoPilot ? "bg-primary-600 border-primary-500 shadow-xl shadow-primary-500/20 text-white" : "bg-white border-slate-200"
        )}>
          <div className="flex flex-col">
            <span className={cn("text-xs font-bold uppercase tracking-widest opacity-60")}>System Status</span>
            <span className="text-lg font-black">{isAutoPilot ? "AUTO-PILOT ON" : "MANUAL MODE"}</span>
          </div>
          <button 
            onClick={toggleAutoPilot}
            className={cn("w-14 h-7 rounded-full relative transition-all", isAutoPilot ? "bg-white" : "bg-slate-200")}
          >
            <div className={cn("absolute top-1 w-5 h-5 rounded-full transition-all shadow-sm", isAutoPilot ? "right-1 bg-primary-600" : "left-1 bg-white")}></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Operational Intelligence" subtitle="Configure automated rules for daily operations.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.id} className={cn(
                  "p-6 rounded-2xl border transition-all duration-300",
                  isAutoPilot ? "bg-white border-primary-100 shadow-sm" : "bg-slate-50 border-slate-100 grayscale opacity-60"
                )}>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                    <feature.icon size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{feature.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Active Automations" subtitle="Real-time execution status.">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="text-sm font-bold text-emerald-800">Room 102 marked Dirty (Checkout)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Just now</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-primary-500" size={20} />
                  <span className="text-sm font-bold text-primary-800">New Booking Assigned to Room 203</span>
                </div>
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter">12m ago</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Auto-Pilot Health">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Efficiency Gain</span>
                <span className="text-sm font-black text-emerald-600">+24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Task Automation</span>
                <span className="text-sm font-black text-slate-800">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-4/5"></div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-slate-900 text-white border-0">
            <h4 className="font-black text-lg mb-2">Need Help?</h4>
            <p className="text-sm text-slate-400 mb-6">Our support team is available 24/7 to help you configure custom automation rules.</p>
            <Button className="w-full bg-white text-slate-900 hover:bg-slate-50">Contact Support</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Automation;
