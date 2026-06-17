import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Activity, AlertTriangle, CheckCircle, Clock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeStaff, setActiveStaff] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resStats = await axios.get('/api/dashboard/stats');
        setStats(resStats.data);

        // Fetch active staff if admin
        if (user.role === 'admin') {
          const resAtt = await axios.get('/api/attendance');
          const active = resAtt.data.filter(a => !a.check_out_time);
          setActiveStaff(active);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, [user.role]);

  const handleCheckIn = async () => {
    try {
      await axios.post('/api/attendance/checkin', { user_id: user.id });
      setIsCheckedIn(true);
      alert('Terminal Online. Shift initialized.');
    } catch (err) {
      alert('Error initializing shift');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('/api/attendance/checkout', { user_id: user.id });
      setIsCheckedIn(false);
      alert('Terminal Offline. Shift concluded.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error concluding shift');
    }
  };

  if (!stats) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="animate-pulse text-slate-400 font-semibold tracking-wider uppercase text-sm">Initializing Interface...</div>
      </div>
    </div>
  );

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Production Output (Tons)',
        data: [1200, 1900, 1500, 2100, 1800, 900, 800],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        hoverBackgroundColor: 'rgba(96, 165, 250, 1)',
        borderRadius: 6,
        borderWidth: 0,
      }
    ]
  };

  const doughnutData = {
    labels: ['Operational', 'Maintenance', 'Offline'],
    datasets: [
      {
        data: [12, stats.pendingMaintenance, 1],
        backgroundColor: ['#10B981', '#F59E0B', '#F43F5E'],
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'inherit' } }
      }
    },
    scales: {
      y: { grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'inherit', size: 12 }, padding: 20 } }
    },
    cutout: '75%'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">System Status <span className="text-blue-500">•</span> Active</h2>
          <p className="text-slate-400 mt-1">Welcome back, <span className="text-slate-200 font-semibold">{user.name}</span>. The plant is operating normally.</p>
        </div>
        
        {/* Actions depending on role */}
        <div className="flex items-center gap-3 relative z-10">
          {user.role === 'employee' ? (
            <>
              <button onClick={handleCheckIn} disabled={isCheckedIn} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 ${isCheckedIn ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white hover:shadow-emerald-500/25 border border-emerald-400/20'}`}>
                <CheckCircle className="w-4 h-4" /> Initialize Shift
              </button>
              <button onClick={handleCheckOut} disabled={!isCheckedIn} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 ${!isCheckedIn ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white hover:shadow-rose-500/25 border border-rose-400/20'}`}>
                <Clock className="w-4 h-4" /> Conclude Shift
              </button>
            </>
          ) : (
            <Link to="/maintenance" className="btn-primary flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Report Anomaly
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Personnel" value={stats.presentToday} subtitle={`of ${stats.totalEmployees} total staff`} icon={Users} color="text-blue-400" bg="bg-blue-500/10 border border-blue-500/20" />
        <StatCard title="System Efficiency" value="94.2%" subtitle="+2.1% from yesterday" icon={Zap} color="text-emerald-400" bg="bg-emerald-500/10 border border-emerald-500/20" />
        <StatCard title="Active Machinery" value={12} subtitle="Total online units" icon={Activity} color="text-indigo-400" bg="bg-indigo-500/10 border border-indigo-500/20" />
        <StatCard title="Pending Anomalies" value={stats.pendingMaintenance} subtitle="Requires attention" icon={AlertTriangle} color="text-amber-400" bg="bg-amber-500/10 border border-amber-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white tracking-wide">Production Output</h3>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">Last 7 Days</span>
          </div>
          <div className="flex-1 min-h-[300px]">
             <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Dynamic Widget */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Hardware Diagnostics</h3>
            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
               <Doughnut data={doughnutData} options={doughnutOptions} />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                 <div className="text-center">
                   <div className="text-3xl font-bold text-white">92%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Uptime</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Admin specific widget */}
          {user.role === 'admin' && (
            <div className="glass-card p-0 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase">Active Operators</h3>
                <Link to="/attendance" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors">
                  View Logs <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                {activeStaff.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">No active operators.</div>
                ) : (
                  activeStaff.slice(0, 3).map(staff => (
                    <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{staff.userName}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Online
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {new Date(staff.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }) {
  return (
    <div className="glass-card relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h4 className="text-3xl font-extrabold text-white tracking-tight">{value}</h4>
          </div>
          <div className={`p-3 rounded-xl ${bg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        <div className="mt-4 text-sm font-medium text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}
