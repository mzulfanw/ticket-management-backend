import { env } from './env';

export const APP_CONFIG = {
  secret_key: env.JWT_SECRET,
  port: Number(env.PORT),
  isProd: env.NODE_ENV === 'production'
};
