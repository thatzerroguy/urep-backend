import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
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
