import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to current working directory

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/skill2hire',
  JWT_SECRET: process.env.JWT_SECRET || 'skill2hire_super_secret_jwt_key_2026_capstone_project',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || '',
  ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || '',
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || ''
};
