import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, Mail, Lock, ArrowRight, User, Building2, MapPin, Globe, CreditCard } from 'lucide-react';
import { Button, Card } from '../../components/common/UI';
import { cn } from '../../utils/cn';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hotelName: '',
    city: '',
    country: '',
    roomsCount: '',
    plan: 'Standard',
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);
    // For demo purposes, we can navigate to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-5">
        
        {/* Left Sidebar: Info */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-12 bg-primary-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-lg">
                <Hotel size={24} />
              </div>
              <span className="font-black text-xl tracking-tighter">AutoPilot</span>
            </Link>
            
            <h1 className="text-4xl font-black leading-tight tracking-tighter mb-6">
              Join the Future of <br /> 
              <span className="text-primary-200">Hospitality.</span>
            </h1>
            
            <div className="space-y-6 mt-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold">Flexible Plans</p>
                  <p className="text-sm text-primary-100">Choose a plan that fits your hotel's scale and needs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-bold">Global Ready</p>
                  <p className="text-sm text-primary-100">Our platform supports multi-currency and global standards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <p className="text-sm text-primary-100">Already have an account?</p>
            <Link to="/login" className="text-white font-bold hover:text-primary-200 transition-colors inline-flex items-center gap-2 mt-1">
              Sign in to your dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 lg:col-span-3 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 font-medium mt-1">Set up your hotel and administrator profile in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Hotel Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 size={18} className="text-primary-500" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Hotel Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Hotel Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                    placeholder="e.g. Grand AutoPilot Resort"
                    value={formData.hotelName}
                    onChange={e => setFormData({...formData, hotelName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                      placeholder="New York"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Country</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                    placeholder="USA"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Rooms Count</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                    placeholder="50"
                    value={formData.roomsCount}
                    onChange={e => setFormData({...formData, roomsCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Plan Selection</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                    value={formData.plan}
                    onChange={e => setFormData({...formData, plan: e.target.value})}
                  >
                    <option>Standard</option>
                    <option>Enterprise</option>
                    <option>Trial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Admin Info */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={18} className="text-primary-500" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Administrator Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                      placeholder="admin@hotel.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 rounded-xl transition-all outline-none text-slate-800 text-sm font-medium"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-base font-black shadow-xl shadow-primary-500/20 gap-2 mt-4">
              Get Started <ArrowRight size={20} />
            </Button>
          </form>
          
          <div className="mt-8 text-center block lg:hidden">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            By signing up, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
