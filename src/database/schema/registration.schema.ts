import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { userSchema } from './user.schema';
import { programmeSchema } from './programme.schema';
import { responseSchema } from './response.schema';

export const registrationSchema = pgTable('registrations', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  user_id: uuid('user_id')
    .references(() => userSchema.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  programme_id: uuid('programme_id')
    .references(() => programmeSchema.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const registrationRelations = relations(
  registrationSchema,
  ({ one, many }) => ({
    programme: one(programmeSchema, {
      fields: [registrationSchema.programme_id],
      references: [programmeSchema.id],
    }),
    user: one(userSchema, {
      fields: [registrationSchema.user_id],
      references: [userSchema.id],
    }),
    responses: many(responseSchema),
  }),
);
