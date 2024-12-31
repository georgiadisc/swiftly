import { integer, numeric, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  tag: varchar({ length: 255 }).notNull().unique(),
  address: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 255 }).notNull(),
  balance: numeric({ precision: 19, scale: 4 }).default('0.0').notNull(),
  savings: numeric({ precision: 19, scale: 4 }).default('0.0').notNull(),
  stocks: numeric({ precision: 19, scale: 4 }).default('0.0').notNull(),
  bitcoin: numeric({ precision: 19, scale: 4 }).default('0.0').notNull(),
});
