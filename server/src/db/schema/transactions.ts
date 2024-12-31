import { sql } from 'drizzle-orm';
import { pgTable, varchar, integer, numeric, timestamp, text } from 'drizzle-orm/pg-core';

export const transactionsTable = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  type: varchar({ length: 50 }).notNull(),
  amount: numeric({ precision: 19, scale: 4 }).notNull(),
  balanceAfter: numeric({ precision: 19, scale: 4 }).notNull(),
  targetUserId: integer(),
  description: text(),
  timestamp: timestamp({ mode: 'string', withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
