import { sql } from 'drizzle-orm';
import { decimal, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const paymentsTable = pgTable('payments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  senderUserTag: varchar('sender_user_tag').notNull(),
  receiverUserTag: varchar('receiver_user_tag', { length: 16 }).notNull(),
  note: varchar({ length: 255 }).notNull(),
  amount: decimal('amount').notNull(),
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
