import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, Mail, Lock, ArrowRight, Shield, User, Brush, UserSquare2 } from 'lucide-react';
import { useApp, ROLES } from '../context/AppContext';
import { Button, Card } from '../components/common/UI';
import { cn } from '../utils/cn';

const Login = () => {
  const { setRole, setIsAuthenticated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoUsers = [
    { role: ROLES.SUPER_ADMIN, email: 'superadmin@autopilot.com', pass: 'admin123', label: 'Super Admin', icon: Shield, color: 'bg-purple-100 text-purple-600' },
    { role: ROLES.HOTEL_ADMIN, email: 'manager@grandresort.com', pass: 'manager123', label: 'Hotel Admin', icon: User, color: 'bg-blue-100 text-blue-600' },
    { role: ROLES.FRONT_DESK, email: 'reception@grandresort.com', pass: 'desk123', label: 'Front Desk', icon: UserSquare2, color: 'bg-emerald-100 text-emerald-600' },
    { role: ROLES.HOUSEKEEPING, email: 'service@grandresort.com', pass: 'service123', label: 'Housekeeping', icon: Brush, color: 'bg-amber-100 text-amber-600' },
  ];

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.pass);
    // Note: We'll let handleLogin handle the actual state update
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const demoUser = demoUsers.find(u => u.email === email && u.pass === password);
    
    if (demoUser) {
      setIsAuthenticated(true, {
        name: demoUser.label,
        email: demoUser.email,
        role: demoUser.role
      });
      navigate('/');
    } else if (email && password) {
      // Default to Hotel Admin for unknown users for demo
      setIsAuthenticated(true, {
        name: email.split('@')[0],
        email: email,
        role: ROLES.HOTEL_ADMIN
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl">
                <Hotel size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter">AutoPilot</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Intelligent BMS</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-black leading-tight tracking-tighter mb-6">
              Run Your Hotel <br /> 
              <span className="text-primary-200">on Auto-Pilot.</span>
            </h1>
            <p className="text-lg text-primary-100 leading-relaxed max-w-md">
              The world's most advanced property management system with integrated AI for seamless operations.
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-slate-200"></div>
              ))}
            </div>
            <p className="text-sm font-medium">Joined by 500+ premium hotels worldwide</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-2xl transition-all outline-none text-slate-800 font-medium"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-2xl transition-all outline-none text-slate-800 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary-600 focus:ring-primary-500/20 transition-all" />
                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</a>
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-primary-500/20 gap-2">
              Sign In <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Demo Access</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.role}
                  onClick={() => handleQuickLogin(user)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", user.color)}>
                    <user.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{user.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
