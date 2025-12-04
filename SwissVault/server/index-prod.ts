import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL!);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// СИД — только те колонки, которые реально есть в твоей таблице
const seedTestUser = async () => {
  try {
    const result = await sql`
      SELECT 1 FROM users WHERE username = 'marco.rossi' LIMIT 1
    `;
    if (result.length === 0) {
      await sql`
        INSERT INTO users (username, password, name) 
        VALUES ('marco.rossi', 'password456', 'Marco Rossi')
      `;
      console.log('TEST USER ADDED: marco.rossi / password456');
    }
  } catch (err) {
    console.error('Seed error (ignored):', err);
  }
};
seedTestUser();

// ЛОГИН — под твою таблицу
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Fill all fields' });
  }

  try {
    const result = await sql`
      SELECT username, name FROM users 
      WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    res.json({ message: 'OK', user: user.username, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swiss Bank LIVE on https://myswissbank.onrender.com`);
});
