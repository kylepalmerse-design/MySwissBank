import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),  // ← используем email, как в 99% проектов
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
