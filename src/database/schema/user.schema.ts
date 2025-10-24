import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userSchema = pgTable('users', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  organisation: text('organisation').notNull(),
  nin: varchar('nin', { length: 20 }).notNull().unique(),
  otp: text('otp'),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  dob: date('dob').notNull(),
  gender: text('gender').notNull(),
  state: text('state').notNull(),
  lga: text('lga').notNull(),
  idcode: text('idcode').unique(),
  terms: boolean('terms').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
