import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { programmeSchema } from './programme.schema';
import { responseSchema } from './response.schema';

export const formFieldsSchema = pgTable('form_fields', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  programme_id: uuid('programme_id')
    .references(() => programmeSchema.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  label: text('label').notNull(),
  type: text('type').notNull(),
  required: boolean('required').default(false).notNull(),
  options: jsonb('options'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const formFieldRelations = relations(
  formFieldsSchema,
  ({ one, many }) => ({
    programme: one(programmeSchema, {
      fields: [formFieldsSchema.programme_id],
      references: [programmeSchema.id],
    }),
    responses: many(responseSchema),
  }),
);
