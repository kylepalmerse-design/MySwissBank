import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import { users } from './schema';

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Seed test user (runs once)
const seedTestUser = async () => {
  const exists = await db.select().from(users).where({ login: 'marco.rossi' });
  if (exists.length === 0) {
    const hash = await bcrypt.hash('password456', 10);
    await db.insert(users).values({ login: 'marco.rossi', password: hash });
    console.log('Test user created: marco.rossi');
  }
};
seedTestUser().catch(console.error);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const result = await db.select().from(users).where({ login });
    if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Success', user: user.login });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swiss Bank running on port ${PORT}`);
});
