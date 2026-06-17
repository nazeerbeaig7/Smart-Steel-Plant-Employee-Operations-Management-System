import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

const defaultData = {
  users: [],
  attendance: [],
  leaves: [],
  maintenance_requests: []
};

// Initialize DB if it doesn't exist
async function initDB() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return defaultData;
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper methods for collections
export const db = {
  init: initDB,
  getUsers: async () => (await readDB()).users,
  saveUser: async (user) => {
    const data = await readDB();
    data.users.push(user);
    await writeDB(data);
  },
  updateUser: async (id, updates) => {
    const data = await readDB();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      await writeDB(data);
    }
  },
  
  getAttendance: async () => (await readDB()).attendance,
  saveAttendance: async (record) => {
    const data = await readDB();
    data.attendance.push(record);
    await writeDB(data);
  },
  updateAttendance: async (id, updates) => {
    const data = await readDB();
    const index = data.attendance.findIndex(a => a.id === id);
    if (index !== -1) {
      data.attendance[index] = { ...data.attendance[index], ...updates };
      await writeDB(data);
    }
  },

  getLeaves: async () => (await readDB()).leaves,
  saveLeave: async (leave) => {
    const data = await readDB();
    data.leaves.push(leave);
    await writeDB(data);
  },
  updateLeave: async (id, updates) => {
    const data = await readDB();
    const index = data.leaves.findIndex(l => l.id === id);
    if (index !== -1) {
      data.leaves[index] = { ...data.leaves[index], ...updates };
      await writeDB(data);
    }
  },

  getMaintenance: async () => (await readDB()).maintenance_requests,
  saveMaintenance: async (req) => {
    const data = await readDB();
    data.maintenance_requests.push(req);
    await writeDB(data);
  },
  updateMaintenance: async (id, updates) => {
    const data = await readDB();
    const index = data.maintenance_requests.findIndex(m => m.id === id);
    if (index !== -1) {
      data.maintenance_requests[index] = { ...data.maintenance_requests[index], ...updates };
      await writeDB(data);
    }
  }
};
