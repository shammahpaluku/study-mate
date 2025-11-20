import * as yup from 'yup';

export const envSchema = yup.object({
  NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).required(),
  PORT: yup.number().default(3001),
  APP_NAME: yup.string().required(),
  FRONTEND_URL: yup.string().url().required(),

  DB_HOST: yup.string().required(),
  DB_PORT: yup.number().required(),
  DB_USERNAME: yup.string().required(),
  DB_PASSWORD: yup.string().required(),
  DB_DATABASE: yup.string().required(),
  DB_SYNCHRONIZE: yup.boolean().default(false),
  DB_LOGGING: yup.boolean().default(false),

  JWT_ACCESS_SECRET: yup.string().required(),
  JWT_REFRESH_SECRET: yup.string().required(),
  JWT_ACCESS_EXPIRES_IN: yup.string().required(),
  JWT_REFRESH_EXPIRES_IN: yup.string().required(),

  SMTP_HOST: yup.string().required(),
  SMTP_PORT: yup.number().required(),
  SMTP_USER: yup.string().required(),
  SMTP_PASS: yup.string().required(),
  SMTP_FROM: yup.string().required(),

  DEBUG: yup.boolean().default(false),
}).required();

export type Env = yup.InferType<typeof envSchema>;
