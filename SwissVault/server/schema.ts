import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),  // ← ТВОЯ КОЛОНКА username
  password: text('password').notNull(),           // ← ТВОЯ КОЛОНКА password (в открытом виде)
  name: text('name').notNull(),                   // ← ТВОЯ КОЛОНКА name
  createdAt: timestamp('created_at').defaultNow(),
});
