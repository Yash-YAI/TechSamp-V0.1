import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import routes from './routes/index.js';

const app = express();

// Standard Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle all route calls
app.use(routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

let serverInstance = null;

/**
 * Server Function: Start DB connection and start listening for requests
 */
export const startServer = async (port = config.port) => {
  try {
    // 1. Start Database Connection
    console.log('[Server] Initializing database connection...');
    await connectDB();

    // 2. Start HTTP or HTTPS Server based on configuration
    const isHttps = config.useHttps && fs.existsSync(config.sslKeyPath) && fs.existsSync(config.sslCertPath);

    if (isHttps) {
      const sslOptions = {
        key: fs.readFileSync(path.resolve(config.sslKeyPath)),
        cert: fs.readFileSync(path.resolve(config.sslCertPath)),
      };
      serverInstance = https.createServer(sslOptions, app);
    } else {
      if (config.useHttps) {
        console.warn('[Server] HTTPS was requested, but SSL key/cert files were not found. Falling back to HTTP.');
        console.warn(`[Server] Generate certificates using: npm run cert:generate`);
      }
      serverInstance = http.createServer(app);
    }

    serverInstance.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n[Server Error] Port ${port} is already in use by another process.`);
        console.error(`To free up port ${port}, run:`);
        console.error(`  lsof -ti :${port} | xargs kill -9\n`);
      } else {
        console.error(`[Server Error]: ${err.message}`);
      }
      process.exit(1);
    });

    serverInstance.listen(port, '0.0.0.0', () => {
      const protocol = isHttps ? 'https' : 'http';
      console.log(`[Server] ${isHttps ? 'Secure HTTPS' : 'HTTP'} Server running in ${config.nodeEnv} mode on:`);
      console.log(` - Local:    ${protocol}://localhost:${port}`);
      console.log(` - Network:  ${config.apiBaseUrl}`);
    });

    return serverInstance;
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Server Function: Stop HTTP server and close DB connection gracefully
 */
export const stopServer = async () => {
  console.log('\n[Server] Shutting down server...');

  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
    console.log('[Server] HTTP server stopped.');
  }

  // Stop Database Connection
  await disconnectDB();
  console.log('[Server] Graceful shutdown complete.');
};

// Handle process termination signals
process.on('SIGINT', async () => {
  await stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopServer();
  process.exit(0);
});

// Auto-start when executed directly (node backend/server or node backend/server.js)
const entryFile = process.argv[1] ? path.resolve(process.argv[1]).replace(/\.js$/, '') : '';
const thisFile = fileURLToPath(import.meta.url).replace(/\.js$/, '');

if (entryFile === thisFile || (process.argv[1] && process.argv[1].includes('server'))) {
  startServer();
}

export { app };
export default app;

