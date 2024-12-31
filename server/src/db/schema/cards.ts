import { sql } from 'drizzle-orm';
import { boolean, date, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const cardsTable = pgTable('cards', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  cardType: varchar('card_type', { length: 20 }).notNull(),
  lastFourDigits: varchar('last_four_digits', { length: 4 }).notNull().unique(),
  expirationDate: date('expiration_date').notNull(),
  isLocked: boolean('is_locked').default(false),
  isDefault: boolean('is_default').default(true),
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
