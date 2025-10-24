import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { userSchema } from './user.schema';

export const programInfoSchema = pgTable('program-info', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  user_id: uuid('user_id').references(() => userSchema.id, {
    onDelete: 'cascade',
  }),
  programme: text('programme').notNull(),
  expectations: text('expectations').notNull(),
  knowledge: text('knowledge').notNull(),
  organization: text('organization').notNull(),
  similar_participation: text('similar_participation').notNull(),
  previous_fmyd: text('previous_fmyd').notNull(),
});

export const programInfoRelations = relations(programInfoSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [programInfoSchema.user_id],
    references: [userSchema.id],
  }),
}));
