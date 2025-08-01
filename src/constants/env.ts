import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(4, 'JWT_SECRET must be at least 4 characters'),
  MONGO_URI: z.string().url('Invalid MongoDB connection string'),
});

const parsed = envSchema.safeParse(process.env);

const defaultTestEnv = {
  NODE_ENV: 'test',
  PORT: '4000',
  JWT_SECRET: 'test-secret',
  MONGO_URI: 'http://localhost:27017/ticket_system',
};

export const env = parsed.success
  ? parsed.data
  : process.env.NODE_ENV === 'test'
    ? defaultTestEnv
    : (() => {
      console.error('❌ Invalid environment variables:');
      console.error(JSON.stringify(parsed.error.format(), null, 2));
      process.exit(1);
    })();
