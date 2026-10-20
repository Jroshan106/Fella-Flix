const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
const { NextRequest } = require('next/server');
const filename = path.resolve('src/app/api/superembed/route.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const route = new Module(filename, module);
route.filename = filename;
route.paths = module.paths;
const originalRequire = route.require.bind(route);
route.require = id => id === '@/lib/auth-server' ? { currentViewer: async () => ({ username: 'fixture' }) } : originalRequire(id);
route._compile(compiled, filename);
const request = (query) => new NextRequest('http://localhost/api/superembed?' + query);
(async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => { throw Error('Invalid IDs must not call upstream'); };
    for (const query of ['', 'id=0', 'id=abc', 'id=550%26other=1']) {
      assert.equal((await route.exports.GET(request(query))).status, 400);
    }
    global.fetch = async (url, options) => {
      assert.equal(url.searchParams.get('video_id'), '550');
      assert.equal(url.searchParams.get('tmdb'), '1');
      assert.equal(options.cache, 'no-store');
      return new Response(' https://streamingnow.mov/?play=test\n');
    };
    let result = await route.exports.GET(request('id=550&format=json'));
    assert.equal(result.status, 200);
    assert.equal((await result.json()).provider, 'SuperEmbed');
    assert.equal(result.headers.get('cache-control'), 'no-store');
    result = await route.exports.GET(request('id=550'));
    assert.equal(result.status, 307);
    assert.equal(result.headers.get('location'), 'https://streamingnow.mov/?play=test');
    for (const body of ['<script>alert(1)</script>', 'https://evil.example/', 'http://streamingnow.mov/', 'https://user:pass@streamingnow.mov/']) {
      global.fetch = async () => new Response(body);
      assert.equal((await route.exports.GET(request('id=550&format=json'))).status, 502);
    }
    global.fetch = async () => new Response('down', {status: 503});
    assert.equal((await route.exports.GET(request('id=550'))).status, 502);
    global.fetch = async () => { throw new DOMException('Timed out', 'TimeoutError'); };
    assert.equal((await route.exports.GET(request('id=550'))).status, 502);
    console.log('PASS: 12 resolver validation, success, redirect and failure cases');
  } finally { global.fetch = originalFetch; }
})().catch(error => { console.error(error); process.exitCode = 1; });
