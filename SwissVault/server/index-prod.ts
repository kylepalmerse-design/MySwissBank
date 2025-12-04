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

// Отдаём статику (фронтенд)
app.use(express.static(path.join(__dirname, '../dist')));

// === СИД ТЕСТОВОГО ПОЛЬЗОВАТЕЛЯ ===
const seedTestUser = async () => {
  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, 'marco.rossi'))
      .limit(1);

    if (existing.length === 0) {
      const hash = await bcrypt.hash('password456', 10);
      await db.insert(users).values({
        email: 'marco.rossi',
        password: hash,
      });
      console.log('Test user created: marco.rossi / password456');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};
seedTestUser();

// === ЛОГИН ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: user.email });
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
