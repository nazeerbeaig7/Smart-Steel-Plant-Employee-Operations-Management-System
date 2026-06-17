import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Simple dashboard stats
router.get('/stats', async (req, res) => {
  const users = await db.getUsers();
  const attendance = await db.getAttendance();
  const maintenance = await db.getMaintenance();

  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today).length;

  const pendingIssues = maintenance.filter(m => m.status === 'pending').length;

  res.json({
    totalEmployees: users.filter(u => u.role !== 'admin').length,
    presentToday,
    pendingMaintenance: pendingIssues,
    totalMaintenance: maintenance.length
  });
});

export default router;
