import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Maintenance from './components/Maintenance';
import AttendanceLogs from './components/AttendanceLogs';
import Employees from './components/Employees';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="attendance" element={<AttendanceLogs />} />
        <Route path="employees" element={<Employees />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
