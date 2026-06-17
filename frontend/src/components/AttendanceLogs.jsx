import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Search, Clock, LogIn, LogOut, Activity } from 'lucide-react';

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/attendance');
      // Sort by check-in time, newest first
      const sortedLogs = res.data.sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time));
      setLogs(sortedLogs);
    } catch (err) {
      console.error('Failed to fetch attendance logs', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkOut) return '---';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffHours = Math.abs(end - start) / 36e5;
    return `${diffHours.toFixed(2)} hrs`;
  };

  const getStatusBadge = (log) => {
    if (!log.check_out_time) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          On Shift
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        Checked Out
      </span>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName?.toLowerCase().includes(search.toLowerCase()) || 
                          log.date.includes(search);
    
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = !log.check_out_time;
    if (filterStatus === 'completed') matchesStatus = !!log.check_out_time;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Attendance Logs</h2>
          <p className="text-slate-400 text-sm">Monitor staff shifts and working hours.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-slate-300">Total Records: <span className="text-white">{logs.length}</span></span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Search by name or date (YYYY-MM-DD)..."
            className="input-field pl-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer font-semibold text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Shifts</option>
          <option value="active">Active (On Shift)</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-200">{log.userName}</div>
                    <div className="text-xs text-slate-500 capitalize">{log.userRole}</div>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-400">
                    {log.date}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <LogIn className="w-3.5 h-3.5 text-blue-400" />
                      {new Date(log.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-300">
                    {log.check_out_time ? (
                      <span className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(log.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-600">--:--</span>
                    )}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {calculateDuration(log.check_in_time, log.check_out_time)}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    {getStatusBadge(log)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No attendance logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
