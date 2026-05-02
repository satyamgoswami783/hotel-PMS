import React, { useState } from 'react';
import { 
  Brush, 
  Trash2, 
  Wrench, 
  CheckCircle2, 
  UserPlus, 
  History, 
  MoreHorizontal, 
  Search,
  User,
  Clock,
  Play,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, Modal, Drawer } from '../components/common/UI';
import { cn } from '../utils/cn';

const Housekeeping = () => {
  const { rooms, staff, assignHousekeeping, updateRoomStatus, systemEvents, addToast } = useApp();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAssign = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAssign = (staffId) => {
    assignHousekeeping(selectedRoom.id, staffId);
    setIsModalOpen(false);
  };

  const handleStartCleaning = (roomId) => {
    updateRoomStatus(roomId, { cleaning: 'cleaning' });
    addToast(`Cleaning started for Room ${roomId}`);
  };

  const handleMarkClean = (roomId) => {
    updateRoomStatus(roomId, { 
      cleaning: 'clean', 
      status: 'vacant', 
      assignedStaff: null, 
      lastCleaned: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
    addToast(`Room ${roomId} is now Clean and Ready to Sell`);
  };

  const handleMarkFixed = (roomId) => {
    updateRoomStatus(roomId, { status: 'vacant', cleaning: 'clean' });
    addToast(`Room ${roomId} maintenance completed. Status: Clean + Vacant`);
  };

  const filteredRooms = rooms.filter(r => 
    r.id.includes(searchQuery) || 
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const housekeepingLogs = systemEvents.filter(e => 
    e.message.toLowerCase().includes('room') || 
    e.message.toLowerCase().includes('housekeeping') ||
    e.message.toLowerCase().includes('staff')
  );

  // Summary Metrics
  const metrics = {
    readyToSell: rooms.filter(r => r.status === 'vacant' && r.cleaning === 'clean').length,
    needCleaning: rooms.filter(r => r.status === 'vacant' && r.cleaning === 'dirty').length,
    inProgress: rooms.filter(r => r.cleaning === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance' || r.cleaning === 'maintenance').length
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Housekeeping Operations</h1>
          <p className="text-slate-500 mt-1">Real-time room status management and crew coordination.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" onClick={() => setIsLogOpen(true)}><History size={18} /> Activity Log</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-emerald-50 border-emerald-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Ready to Sell</p>
              <h2 className="text-4xl font-black text-emerald-700 mt-1">{metrics.readyToSell}</h2>
            </div>
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><CheckCircle2 size={20} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="success" className="text-[9px] px-1.5 py-0.5">VACANT</Badge>
            <Badge variant="success" className="text-[9px] px-1.5 py-0.5">CLEAN</Badge>
          </div>
        </Card>

        <Card className="bg-rose-50 border-rose-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest">Need Cleaning</p>
              <h2 className="text-4xl font-black text-rose-700 mt-1">{metrics.needCleaning}</h2>
            </div>
            <div className="p-2 bg-rose-100 rounded-xl text-rose-600"><Trash2 size={20} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="slate" className="text-[9px] px-1.5 py-0.5">VACANT</Badge>
            <Badge variant="error" className="text-[9px] px-1.5 py-0.5">DIRTY</Badge>
          </div>
        </Card>

        <Card className="bg-amber-50 border-amber-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest">In Progress</p>
              <h2 className="text-4xl font-black text-amber-700 mt-1">{metrics.inProgress}</h2>
            </div>
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><Brush size={20} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="warning" className="text-[9px] px-1.5 py-0.5">CLEANING ACTIVE</Badge>
          </div>
        </Card>

        <Card className="bg-orange-50 border-orange-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">Maintenance</p>
              <h2 className="text-4xl font-black text-orange-700 mt-1">{metrics.maintenance}</h2>
            </div>
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600"><Wrench size={20} /></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="danger" className="text-[9px] px-1.5 py-0.5">OUT OF ORDER</Badge>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by room or type..." 
            className="input-field pl-10" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Housekeeping Crew</span>
            <span className="text-sm font-bold text-slate-700">{staff.length} Active Staff</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100"></div>
          <div className="flex -space-x-2">
            {staff.map(s => (
              <div key={s.id} className="w-8 h-8 rounded-full bg-primary-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-600 cursor-help" title={`${s.name} - ${s.status}`}>
                {s.name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          const isOccupied = room.status === 'occupied';
          const isDirty = room.cleaning === 'dirty';
          const isCleaning = room.cleaning === 'cleaning';
          const isClean = room.cleaning === 'clean';
          const isMaintenance = room.status === 'maintenance' || room.cleaning === 'maintenance';
          const isVacant = room.status === 'vacant';

          return (
            <Card key={room.id} className="p-0 overflow-hidden group border-slate-100 hover:border-primary-200 transition-all shadow-sm hover:shadow-md">
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-sm",
                    isClean && isVacant ? "bg-emerald-100 text-emerald-700" : 
                    isDirty ? "bg-rose-100 text-rose-700" : 
                    isCleaning ? "bg-amber-100 text-amber-700 animate-pulse" : 
                    isMaintenance ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {room.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{room.type}</h4>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={isOccupied ? 'primary' : 'slate'} className="text-[8px] px-1.5 py-0.5 font-black">
                        {isOccupied ? 'OCCUPIED' : 'VACANT'}
                      </Badge>
                      <Badge 
                        variant={isClean ? 'success' : isDirty ? 'error' : isCleaning ? 'warning' : 'danger'} 
                        className="text-[8px] px-1.5 py-0.5 font-black"
                      >
                        {room.cleaning?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Staff</label>
                    <button 
                      onClick={() => handleOpenAssign(room)}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-left group/btn"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover/btn:bg-primary-100 group-hover/btn:text-primary-600 transition-colors">
                          <User size={12} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                          {room.assignedStaff || 'Unassigned'}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Cleaned</span>
                    </div>
                    <span className="text-xs font-black text-slate-700">{room.lastCleaned}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {/* Case 1: Vacant + Dirty */}
                  {isVacant && isDirty && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" className="text-[10px] h-10 gap-1 font-bold" onClick={() => handleOpenAssign(room)}>
                        <UserPlus size={14} /> Assign
                      </Button>
                      <Button className="text-[10px] h-10 gap-1 font-bold bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20" onClick={() => handleStartCleaning(room.id)}>
                        <Play size={14} /> Start
                      </Button>
                    </div>
                  )}

                  {/* Case 2: In Progress */}
                  {isCleaning && (
                    <Button className="w-full text-[10px] h-10 gap-1 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20" onClick={() => handleMarkClean(room.id)}>
                      <CheckCircle2 size={14} /> Mark as Clean
                    </Button>
                  )}

                  {/* Case 4: Maintenance */}
                  {isMaintenance && (
                    <Button className="w-full text-[10px] h-10 gap-1 font-bold bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/20" onClick={() => handleMarkFixed(room.id)}>
                      <Wrench size={14} /> Mark Fixed
                    </Button>
                  )}

                  {/* Case 3: Vacant + Clean (Ready to Sell) */}
                  {isVacant && isClean && (
                    <div className="h-10 flex items-center justify-center border-2 border-emerald-100 bg-emerald-50/50 rounded-xl">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} /> Ready to Sell
                      </span>
                    </div>
                  )}

                  {/* Case 5: Occupied (In Use) */}
                  {isOccupied && (
                    <div className="h-10 flex items-center justify-center border-2 border-slate-100 bg-slate-50/50 rounded-xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} /> In Use
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Assign Housekeeper: Room ${selectedRoom?.id}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-6">Select a team member to assign this cleaning task. They will receive an instant notification on their mobile device.</p>
          <div className="grid grid-cols-1 gap-3">
            {staff.map(member => (
              <button 
                key={member.id} 
                onClick={() => handleAssign(member.id)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-primary-500 hover:bg-primary-50 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors shadow-sm">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>
                <Badge variant={member.status === 'Available' ? 'success' : 'warning'} className="text-[9px] px-2 py-0.5">
                  {member.status.toUpperCase()}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Drawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Housekeeping Activity Log">
        <div className="space-y-4">
          {housekeepingLogs.length > 0 ? housekeepingLogs.map(log => (
            <div key={log.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                    <Clock size={12} className="text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{log.time}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{log.message}</p>
            </div>
          )) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History size={24} className="text-slate-200" />
              </div>
              <p className="text-sm font-bold text-slate-400">No recent activity recorded.</p>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Housekeeping;
