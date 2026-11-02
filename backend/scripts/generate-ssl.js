import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const certsDir = path.resolve(__dirname, '../certs');

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

// Determine IP / Hostnames to include
const hosts = ['localhost', '127.0.0.1'];

if (process.env.API_BASE_URL) {
  try {
    const parsed = new URL(process.env.API_BASE_URL);
    if (parsed.hostname && !hosts.includes(parsed.hostname)) {
      hosts.push(parsed.hostname);
    }
  } catch {
    // ignore
  }
}

// Check if mkcert is available on the system
let hasMkcert = false;
try {
  execSync('which mkcert', { stdio: 'ignore' });
  hasMkcert = true;
} catch {
  hasMkcert = false;
}

if (hasMkcert) {
  console.log(`[SSL] Using mkcert to generate trusted certificates for: ${hosts.join(' ')}`);
  try {
    const mkcertCmd = `mkcert -key-file "${keyPath}" -cert-file "${certPath}" ${hosts.join(' ')}`;
    execSync(mkcertCmd, { stdio: 'inherit' });
    console.log('[SSL] Certificates successfully generated with mkcert!');
    console.log(` - Key:  ${keyPath}`);
    console.log(` - Cert: ${certPath}`);
  } catch (error) {
    console.warn('[SSL] mkcert command failed, falling back to openssl...', error.message);
    generateWithOpenssl();
  }
} else {
  generateWithOpenssl();
}

function generateWithOpenssl() {
  const sanList = hosts.map((h) => (/^(\d{1,3}\.){3}\d{1,3}$/.test(h) ? `IP:${h}` : `DNS:${h}`));
  const sanString = sanList.join(',');

  console.log(`[SSL] Generating self-signed certificate with OpenSSL (SAN: ${sanString})...`);
  try {
    const opensslCmd = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
      -keyout "${keyPath}" \
      -out "${certPath}" \
      -subj "/C=US/ST=State/L=City/O=Development/CN=localhost" \
      -addext "subjectAltName=${sanString}"`;

    execSync(opensslCmd, { stdio: 'inherit' });
    console.log('[SSL] Certificates successfully generated with OpenSSL!');
  } catch (error) {
    console.error('[SSL] OpenSSL generation failed:', error.message);
    process.exit(1);
  }
}
