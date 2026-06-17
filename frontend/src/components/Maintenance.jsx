import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Wrench, Clock, CheckCircle } from 'lucide-react';

export default function Maintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [machineName, setMachineName] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/maintenance');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/maintenance/report', {
        reported_by: user.name,
        machine_name: machineName,
        issue_desc: issueDesc
      });
      setIsFormOpen(false);
      setMachineName('');
      setIssueDesc('');
      fetchRequests();
    } catch (err) {
      alert('Failed to report issue');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/maintenance/${id}`, { status });
      fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      case 'in-progress': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1"><Wrench className="w-3 h-3"/> In Progress</span>;
      case 'resolved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-steel-900">Maintenance</h2>
          <p className="text-steel-500">Report and track machinery issues.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {isFormOpen && (
        <div className="card bg-white border-blue-100 shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-steel-900">New Maintenance Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">Machine Name / ID</label>
              <input type="text" required className="input-field" value={machineName} onChange={e => setMachineName(e.target.value)} placeholder="e.g. Blast Furnace B1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">Issue Description</label>
              <textarea required rows="3" className="input-field" value={issueDesc} onChange={e => setIssueDesc(e.target.value)} placeholder="Describe the problem..." />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-steel-600 hover:text-steel-800 font-medium transition-colors">Cancel</button>
              <button type="submit" className="btn-primary">Submit Report</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <table className="min-w-full divide-y divide-steel-200">
          <thead className="bg-steel-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-steel-500 uppercase tracking-wider">Machine</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-steel-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-steel-500 uppercase tracking-wider">Reported By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-steel-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-steel-500 uppercase tracking-wider">Status</th>
              {user?.role === 'admin' && <th className="px-6 py-3 text-right text-xs font-semibold text-steel-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-steel-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-steel-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-steel-900">{req.machine_name}</td>
                <td className="px-6 py-4 text-sm text-steel-500 max-w-xs truncate">{req.issue_desc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-steel-500">{req.reported_by}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-steel-500">{new Date(req.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {req.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(req.id, 'in-progress')} className="text-blue-600 hover:text-blue-900 mr-3">Start Work</button>
                    )}
                    {req.status === 'in-progress' && (
                      <button onClick={() => handleUpdateStatus(req.id, 'resolved')} className="text-green-600 hover:text-green-900">Mark Resolved</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-steel-500">No maintenance requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
