import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'node:fs';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      ca: readFileSync('/etc/postgresql/ca.crt').toString(),
      rejectUnauthorized: false,
    },
  },
});
