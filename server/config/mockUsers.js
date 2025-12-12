import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const filePath = path.resolve(new URL('.', import.meta.url).pathname, './mockUsers.json');

const ensureFile = async () => {
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify({ users: [] }, null, 2));
  }
};

const readStore = async () => {
  await ensureFile();
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
};

const writeStore = async (store) => {
  await fs.writeFile(filePath, JSON.stringify(store, null, 2));
};

export const findByEmail = async (email) => {
  const store = await readStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findById = async (id) => {
  const store = await readStore();
  return store.users.find((u) => u.id === id) || null;
};

export const findWithPassword = async (email) => {
  return await findByEmail(email);
};

export const createUser = async ({ name, email, password }) => {
  const store = await readStore();
  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const err = new Error('User already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const newUser = {
    id: `m${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name,
    email,
    password: hashed,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  store.users.push(newUser);
  await writeStore(store);
  return newUser;
};

export default {
  findByEmail,
  findById,
  findWithPassword,
  createUser,
};

// Initialize default demo users if store is empty
const initDefaults = async () => {
  try {
    const store = await readStore();
    if (!store.users || store.users.length === 0) {
      const adminPass = await bcrypt.hash('admin123', 10);
      const demoPass = await bcrypt.hash('demo123', 10);
      store.users = [
        {
          id: 'm-admin',
          name: 'Admin User',
          email: 'admin@local.test',
          password: adminPass,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm-demo',
          name: 'Demo Customer',
          email: 'demo@local.test',
          password: demoPass,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
      ];
      await writeStore(store);
      console.log('✅ Mock users initialized with demo accounts');
    }
  } catch (err) {
    console.error('Error initializing mock users:', err.message);
  }
};

initDefaults();
