import dotenv from 'dotenv';
import path from 'path';

// Resolve from server/src/config to root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];

for (const v of requiredVars) {
  if (!process.env[v]) {
    console.warn(`⚠️  Warning: ${v} is not set in environment variables`);
  }
}

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-eraser',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
} as const;
