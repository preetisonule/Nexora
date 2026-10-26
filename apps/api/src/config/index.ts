import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/compilo_learn',
  jwtSecret: process.env.JWT_SECRET || 'compilo_learn_jwt_secure_key_development_2026_at_least_32_chars',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'compilo_learn_cookie_secret_salt_2026',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  admin: {
    name: process.env.ADMIN_NAME || 'System Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@compilolearn.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
  go: {
    binaryPath: process.env.GO_BINARY_PATH || 'C:\\Program Files\\Go\\bin\\go.exe',
    timeoutMs: parseInt(process.env.GO_EXECUTION_TIMEOUT_MS || '10000', 10),
    compileTimeoutMs: parseInt(process.env.GO_COMPILE_TIMEOUT_MS || '60000', 10),
    maxOutputBytes: parseInt(process.env.MAX_OUTPUT_BUFFER_BYTES || '65536', 10),
  },
};
