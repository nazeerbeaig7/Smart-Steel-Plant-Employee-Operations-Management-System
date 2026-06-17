import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all employees (admin only typically)
router.get('/', async (req, res) => {
  const users = await db.getUsers();
  // Don't send passwords
  const employees = users.map(({ password, ...user }) => user);
  res.json(employees);
});

// Get a specific employee profile
router.get('/:id', async (req, res) => {
  const users = await db.getUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

export default router;
