import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../context/AppContext';
import { ToastContainer } from '../common/UI';

export const Layout = () => {
  const { toasts } = useApp();
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 mt-16 p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
};
