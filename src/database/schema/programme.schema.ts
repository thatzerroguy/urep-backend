import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { formFieldsSchema } from './formFields.schema';
import { registrationSchema } from './registration.schema';

export const programmeSchema = pgTable('programmes', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  objectives: text('objectives')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  target_audience: text('target_audience')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const programmeRelations = relations(programmeSchema, ({ many }) => ({
  formFields: many(formFieldsSchema),
  registrations: many(registrationSchema),
}));
