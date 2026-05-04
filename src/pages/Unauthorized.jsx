import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/UI';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
          <ShieldAlert size={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Denied</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            You do not have the required permissions to view this section. Please contact your system administrator if you believe this is an error.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            variant="secondary" 
            className="w-full h-12 gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
