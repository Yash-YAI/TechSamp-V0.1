import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve project root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

// Load environment variables
dotenv.config({ path: envPath });

export const config = {
  port: process.env.PORT || 5003,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.API_BASE_URL || 'https://192.163.0.23:5003',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techsamp_db',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  useHttps: process.env.USE_HTTPS === 'true',
  sslKeyPath: process.env.SSL_KEY_PATH || path.resolve(__dirname, '../certs/key.pem'),
  sslCertPath: process.env.SSL_CERT_PATH || path.resolve(__dirname, '../certs/cert.pem'),
};

export default config;

