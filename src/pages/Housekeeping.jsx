import React, { useState } from 'react';
import { Brush, Trash2, Wrench, CheckCircle2, UserPlus, History, MoreVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, Modal } from '../components/common/UI';
import { cn } from '../utils/cn';

const Housekeeping = () => {
  const { rooms, staff, assignHousekeeping, updateRoomStatus } = useApp();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAssign = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAssign = (staffId) => {
    assignHousekeeping(selectedRoom.id, staffId);
    setIsModalOpen(false);
  };

  const setStatus = (roomId, cleaning) => {
    updateRoomStatus(roomId, { cleaning });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Housekeeping</h1>
          <p className="text-slate-500 mt-1">Monitor room cleanliness and assign cleaning tasks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2"><History size={18} /> Activity Log</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Ready to Sell</p>
          <h2 className="text-3xl font-black text-emerald-700 mt-1">{rooms.filter(r => r.cleaning === 'clean').length}</h2>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest">Need Cleaning</p>
          <h2 className="text-3xl font-black text-rose-700 mt-1">{rooms.filter(r => r.cleaning === 'dirty').length}</h2>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest">In Progress</p>
          <h2 className="text-3xl font-black text-amber-700 mt-1">2</h2>
        </Card>
        <Card className="bg-primary-50 border-primary-100">
          <p className="text-primary-600 text-[10px] font-bold uppercase tracking-widest">Available Staff</p>
          <h2 className="text-3xl font-black text-primary-700 mt-1">{staff.filter(s => s.status === 'Available').length}</h2>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="p-0 overflow-hidden group">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-110",
                  room.cleaning === 'clean' ? "bg-emerald-100 text-emerald-700" : 
                  room.cleaning === 'dirty' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                )}>
                  {room.id}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{room.type}</h4>
                  <Badge variant={room.status === 'occupied' ? 'primary' : 'slate'}>{room.status}</Badge>
                </div>
              </div>
              <button onClick={() => handleOpenAssign(room)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                <UserPlus size={18} />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-2 bg-white">
              <button onClick={() => setStatus(room.id, 'clean')} className={cn("flex flex-col items-center gap-1 p-2 rounded-xl border transition-all", room.cleaning === 'clean' ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-slate-100 text-slate-400 hover:bg-slate-50")}>
                <CheckCircle2 size={16} /><span className="text-[8px] font-black uppercase">Clean</span>
              </button>
              <button onClick={() => setStatus(room.id, 'dirty')} className={cn("flex flex-col items-center gap-1 p-2 rounded-xl border transition-all", room.cleaning === 'dirty' ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm" : "border-slate-100 text-slate-400 hover:bg-slate-50")}>
                <Trash2 size={16} /><span className="text-[8px] font-black uppercase">Dirty</span>
              </button>
              <button onClick={() => setStatus(room.id, 'maintenance')} className={cn("flex flex-col items-center gap-1 p-2 rounded-xl border transition-all", room.cleaning === 'maintenance' ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm" : "border-slate-100 text-slate-400 hover:bg-slate-50")}>
                <Wrench size={16} /><span className="text-[8px] font-black uppercase">Repair</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Assign Staff to Room ${selectedRoom?.id}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-6">Select an available team member to assign this cleaning task.</p>
          {staff.map(member => (
            <button 
              key={member.id} 
              onClick={() => handleAssign(member.id)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  {member.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <Badge variant={member.status === 'Available' ? 'success' : 'warning'}>{member.status}</Badge>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Housekeeping;
