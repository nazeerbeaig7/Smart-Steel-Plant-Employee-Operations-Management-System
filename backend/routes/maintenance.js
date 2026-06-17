import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all maintenance requests
router.get('/', async (req, res) => {
  const requests = await db.getMaintenance();
  res.json(requests);
});

// Report an issue
router.post('/report', async (req, res) => {
  const { reported_by, machine_name, issue_desc } = req.body;
  
  if (!reported_by || !machine_name || !issue_desc) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const record = {
    id: Date.now().toString(),
    reported_by,
    machine_name,
    issue_desc,
    status: 'pending', // pending, in-progress, resolved
    created_at: new Date().toISOString(),
    resolved_at: null,
    assigned_to: null
  };

  await db.saveMaintenance(record);
  res.status(201).json({ message: 'Issue reported successfully', record });
});

// Update status
router.put('/:id', async (req, res) => {
  const { status, assigned_to } = req.body;
  const updates = { status };
  if (assigned_to) updates.assigned_to = assigned_to;
  if (status === 'resolved') updates.resolved_at = new Date().toISOString();

  await db.updateMaintenance(req.params.id, updates);
  res.json({ message: 'Maintenance request updated' });
});

export default router;
