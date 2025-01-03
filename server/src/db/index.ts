import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readFileSync } from 'node:fs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: readFileSync('/etc/postgresql/ca.crt').toString(),
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool);

export default db;
