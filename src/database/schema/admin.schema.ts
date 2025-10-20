import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const adminSchema = pgTable('admins', {
  id: serial().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});
