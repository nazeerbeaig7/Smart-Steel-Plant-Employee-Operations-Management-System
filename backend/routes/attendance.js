import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all attendance records (admin usage)
router.get('/', async (req, res) => {
  const allRecords = await db.getAttendance();
  const users = await db.getUsers();
  const recordsWithUser = allRecords.map(rec => {
    const user = users.find(u => u.id === rec.user_id);
    return {
      ...rec,
      userName: user ? user.name : 'Unknown User',
      userEmail: user ? user.email : '',
      userRole: user ? user.role : 'employee'
    };
  });
  res.json(recordsWithUser);
});

// Get attendance records for a user
router.get('/:userId', async (req, res) => {
  const allRecords = await db.getAttendance();
  const userRecords = allRecords.filter(a => a.user_id === req.params.userId);
  res.json(userRecords);
});

// Check-in
router.post('/checkin', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'User ID is required' });

  const record = {
    id: Date.now().toString(),
    user_id,
    date: new Date().toISOString().split('T')[0],
    check_in_time: new Date().toISOString(),
    check_out_time: null
  };

  await db.saveAttendance(record);
  res.status(201).json({ message: 'Checked in successfully', record });
});

// Check-out
router.post('/checkout', async (req, res) => {
  const { user_id } = req.body;
  const allRecords = await db.getAttendance();
  const today = new Date().toISOString().split('T')[0];
  
  // Find today's open record for this user
  const openRecord = allRecords.find(a => a.user_id === user_id && a.date === today && !a.check_out_time);
  
  if (!openRecord) {
    return res.status(400).json({ error: 'No open check-in record found for today' });
  }

  await db.updateAttendance(openRecord.id, { check_out_time: new Date().toISOString() });
  res.json({ message: 'Checked out successfully' });
});

export default router;
