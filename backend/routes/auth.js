import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'employee' } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await db.getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role, // admin, employee, technician
    createdAt: new Date().toISOString()
  };

  await db.saveUser(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await db.getUsers();
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

export default router;
