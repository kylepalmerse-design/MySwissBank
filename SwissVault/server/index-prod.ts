import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import { users } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// СИД — теперь с login
const seedTestUser = async () => {
  try {
    const existing = await db.select().from(users).where(eq(users.login, 'marco.rossi')).limit(1);
    if (existing.length === 0) {
      const hash = await bcrypt.hash('password456', 10);
      await db.insert(users).values({
        login: 'marco.rossi',
        password: hash,
      });
      console.log('Test user created: marco.rossi / password456');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};
seedTestUser();

// ЛОГИН — теперь с login
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password required' });
  }

  try {
    const result = await db.select().from(users).where(eq(users.login, login)).limit(1);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: user.login });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swiss Bank running on port ${PORT}`);
});
