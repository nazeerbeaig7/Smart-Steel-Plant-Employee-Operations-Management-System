import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, User, Hammer, AlertCircle } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        // We pass the selected role to the register API
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to register');
        
        setIsRegister(false);
        setError('Registration successful. Please login.');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Left Side: Brand Panel */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                <Settings className="w-6 h-6 text-white animate-[spin_12s_linear_infinite]" />
              </div>
              <span className="text-xl font-bold tracking-wider text-slate-100 uppercase">SteelPlant OS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mb-6">
              Smart Steel <span className="steel-gradient-text">Operations</span> & Management
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              Monitor real-time production, coordinate staff scheduling, oversee maintenance operations, and leverage AI diagnostics directly from one unified terminal.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800/60 hidden sm:block">
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <Hammer className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Maintenance logs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-900/20">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            {isRegister ? 'Register your plant operator credentials' : 'Sign in to access your terminal dashboard'}
          </p>

          {error && (
            <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 border ${
              error.includes('successful') 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="John Doe" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="operator@steelplant.com" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="input-field" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assigned Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'employee', label: 'Employee', icon: User },
                    { id: 'technician', label: 'Technician', icon: Hammer },
                    { id: 'admin', label: 'Admin', icon: Shield },
                  ].map(r => {
                    const Icon = r.icon;
                    const active = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs gap-1.5 ${
                          active 
                            ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                            : 'bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <button type="submit" className="w-full btn-primary mt-2">
              {isRegister ? 'Register Account' : 'Initialize Terminal'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }} 
              className="text-blue-400 hover:text-blue-300 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
