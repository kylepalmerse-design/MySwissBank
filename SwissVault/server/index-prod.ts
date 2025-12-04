import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// СИД — добавляем marco.rossi, если его нет (пароль в открытом виде, как в твоей таблице)
const seedTestUser = async () => {
  try {
    const existing = await db.select().from(users).where(eq(users.username, 'marco.rossi')).limit(1);
    if (existing.length === 0) {
      await db.insert(users).values({
        username: 'marco.rossi',
        password: 'password456',  // ← Открытый пароль, как в твоей таблице
        name: 'Marco Rossi',
      });
      console.log('Test user created: marco.rossi / password456');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};
seedTestUser();

// ЛОГИН — под твою таблицу (username + password без хэша)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    // Простое сравнение пароля (без bcrypt, как в твоей таблице)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: user.username, name: user.name });
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
