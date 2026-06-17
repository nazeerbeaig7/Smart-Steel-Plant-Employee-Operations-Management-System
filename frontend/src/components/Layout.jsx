import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wrench, LogOut, User as UserIcon, Users, ClipboardList } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { name: 'Employees', path: '/employees', icon: Users },
      { name: 'Attendance Logs', path: '/attendance', icon: ClipboardList }
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">SteelPlant OS</h1>
          </div>
          <p className="text-slate-500 text-xs mt-1 font-semibold uppercase tracking-widest">Active Operator Terminal</p>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between md:hidden">
           <h1 className="text-xl font-bold text-white uppercase tracking-wider">SteelPlant OS</h1>
           <button onClick={logout} className="text-slate-400 hover:text-rose-400 transition-colors">
             <LogOut className="w-6 h-6" />
           </button>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
