import { Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type DrizzleDatabase = NodePgDatabase<typeof schema>;

export const DatabaseProviders: Provider[] = [
  {
    provide: 'DRIZZLE',
    useFactory: (): DrizzleDatabase => {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      return drizzle(pool, { schema });
    },
  },
];
