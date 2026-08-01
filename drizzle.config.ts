import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './migrations/d1',
  dialect: 'sqlite',
} satisfies Config;
