// Run after a production build. Uses isolated test accounts, never real passwords.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { scryptSync, randomBytes } = require('node:crypto');
const port = 3102;
const origin = `http://localhost:${port}`;
const salt = randomBytes(16).toString('hex');
const password = randomBytes(18).toString('base64url');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
  windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, AUTH_SESSION_SECRET: randomBytes(48).toString('base64url'), VIEWER_ACCOUNTS: JSON.stringify([{ username: 'smoke-viewer', passwordHash: `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}` }]) },
});
let started = false;
const timer = setTimeout(() => { console.error('Test server startup timed out.'); server.kill(); process.exitCode = 1; }, 45000);
server.stderr.on('data', () => {});
server.on('exit', code => { if (!started) { clearTimeout(timer); console.error('Test server did not start:', code); process.exitCode = 1; } });
server.stdout.on('data', async chunk => {
  if (started || !chunk.toString().includes('Ready')) return;
  started = true; clearTimeout(timer);
  try {
    for (const path of ['/', '/movies', '/series', '/watch/series/1396', '/request', '/admin']) {
      const response = await fetch(origin + path, { redirect: 'manual' });
      assert.equal(response.status, 307, path);
      assert.equal(new URL(response.headers.get('location'), origin).pathname, '/login');
    }
    assert.equal((await fetch(origin + '/login')).status, 200);
    for (const path of ['/api/catalog?view=home', '/api/superembed?id=550']) assert.equal((await fetch(origin + path)).status, 401);
    assert.equal((await fetch(origin + '/request', { method: 'POST' })).status, 401);
    const form = new FormData(); form.set('username', 'smoke-viewer'); form.set('password', password); form.set('next', '/series');
    const login = await fetch(origin + '/api/auth/login', { method: 'POST', headers: { origin }, body: form });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), { next: '/series' });
    const setCookie = login.headers.get('set-cookie');
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=lax', 'Max-Age=28800']) assert.ok(setCookie.includes(flag), flag);
    const cookie = setCookie.split(';')[0];
    const page = await fetch(origin + '/series', { headers: { cookie } });
    assert.equal(page.status, 200);
    assert.match(page.headers.get('cache-control'), /private|no-store/);
    assert.equal((await fetch(origin + '/api/catalog?view=genres&kind=invalid', { headers: { cookie } })).status, 400);
    assert.equal((await fetch(origin + '/admin', { headers: { cookie } })).status, 401);
    const logout = await fetch(origin + '/api/auth/logout', { method: 'POST', headers: { origin, cookie }, redirect: 'manual' });
    assert.equal(logout.status, 303);
    assert.ok(logout.headers.get('set-cookie').includes('Max-Age=0'));
    console.log('PASS: production page/API gates, sign-in, Secure session cookie, private caching, admin separation and sign-out');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { server.kill(); }
});
