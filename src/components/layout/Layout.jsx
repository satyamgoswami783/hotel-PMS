import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../context/AppContext';
import { ToastContainer } from '../common/UI';

export const Layout = () => {
  const { toasts } = useApp();
  
  return (
    <div className="min-h-screen bg-slate-50 flex min-w-0">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
};
