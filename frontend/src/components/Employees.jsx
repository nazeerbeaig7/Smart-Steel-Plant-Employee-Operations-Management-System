import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Search, Edit2, Trash2, Mail, Hash, Shield } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/users');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Personnel Directory</h2>
          <p className="text-slate-400 text-sm">Manage staff access and roles across the facility.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text"
          placeholder="Search by name or email..."
          className="input-field pl-12 max-w-md"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Employee List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="glass-card p-6 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <Users className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{employee.name}</h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  employee.role === 'admin' 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {employee.role === 'admin' && <Shield className="w-3 h-3" />}
                  {employee.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                {employee.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Hash className="w-4 h-4 text-slate-500" />
                ID: {employee.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 glass-card">
            No personnel found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
