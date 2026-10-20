// Adds an invited viewer to this checkout's private .env.local. Never prints passwords.
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes, scryptSync } = require('node:crypto');
const root = path.resolve(__dirname, '..');
require('@next/env').loadEnvConfig(root);
const username = (process.argv[2] || '').trim().toLowerCase();
const rotate = process.argv.includes('--rotate');
if (!/^[a-z0-9][a-z0-9._-]{1,63}$/.test(username)) throw Error('Supply a username using 2–64 lowercase letters, digits, dots, hyphens or underscores.');
const accounts = JSON.parse(process.env.VIEWER_ACCOUNTS || '[]');
if (!Array.isArray(accounts)) throw Error('VIEWER_ACCOUNTS must be a JSON array.');
const existing = accounts.findIndex(account => account.username === username);
if (existing >= 0 && !rotate) throw Error('That viewer exists. Use --rotate to generate a new password.');
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const account = { username, passwordHash: `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}` };
if (existing >= 0) accounts[existing] = account; else accounts.push(account);
const envPath = path.join(root, '.env.local');
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
function set(name, value) {
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  env = pattern.test(env) ? env.replace(pattern, () => `${name}=${value}`) : env.trimEnd() + `\n${name}=${value}\n`;
}
set('VIEWER_ACCOUNTS', `'${JSON.stringify(accounts)}'`);
if (!process.env.AUTH_SESSION_SECRET) set('AUTH_SESSION_SECRET', randomBytes(48).toString('base64url'));
else if (process.env.AUTH_SESSION_SECRET.length < 32) throw Error('AUTH_SESSION_SECRET must contain at least 32 characters.');
fs.writeFileSync(envPath, env);
const credentials = path.join(root, 'viewer-credentials.local.txt');
fs.appendFileSync(credentials, `${new Date().toISOString()}\nUsername: ${username}\nPassword: ${password}\n${rotate ? 'Previous password and sessions are revoked after restart/redeploy.\n' : ''}\n`, { mode: 0o600 });
console.log(`Viewer ${username} ${rotate ? 'updated' : 'created'}. Password saved privately in viewer-credentials.local.txt.`);
console.log('Restart locally. For Vercel, copy VIEWER_ACCOUNTS and AUTH_SESSION_SECRET from .env.local into Production environment variables, then redeploy.');
