import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { formFieldsSchema } from './formFields.schema';
import { registrationSchema } from './registration.schema';

export const responseSchema = pgTable('responses', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  form_field_id: uuid('form_field_id')
    .references(() => formFieldsSchema.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  answer: text('answer').notNull(),
  registration_id: uuid('registration_id')
    .references(() => registrationSchema.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const responseRelations = relations(responseSchema, ({ one }) => ({
  formField: one(formFieldsSchema, {
    fields: [responseSchema.form_field_id],
    references: [formFieldsSchema.id],
  }),
  registration: one(registrationSchema, {
    fields: [responseSchema.registration_id],
    references: [registrationSchema.id],
  }),
}));
