import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({
  path: path.resolve(__dirname, '../../src/config/.env.development.local'),
});

export default defineConfig({
  schema: './src/database/schema',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
