import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';

import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import attendanceRoutes from './routes/attendance.js';
import maintenanceRoutes from './routes/maintenance.js';
import dashboardRoutes from './routes/dashboard.js';
import chatbotRoutes from './routes/chatbot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize JSON DB
db.init().then(() => {
  console.log("Database initialized");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Steel Plant API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
