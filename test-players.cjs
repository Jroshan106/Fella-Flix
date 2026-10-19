const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
const filename = path.resolve('src/app/data/streaming.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const config = new Module(filename, module);
config.filename = filename;
config.paths = module.paths;
config._compile(compiled, filename);
const { STREAMING_SERVERS: servers, getStreamingServer, getMovieEmbedUrl, PLAYER_SANDBOX } = config.exports;
assert.equal(servers.length, 8);
assert.equal(new Set(servers.map(s => s.id)).size, 8);
assert.equal(servers[0].id, 'yapgrid');
assert.equal(getStreamingServer('peestream').id, 'yapgrid');
assert.deepEqual(servers.slice(-3).map(s => s.id), ['vidlink', 'vidfast', 'videasy']);
assert.equal(getStreamingServer('0'), servers[0]);
assert.equal(getStreamingServer('superembed'), servers[0]);
assert.equal(getStreamingServer(null), servers[0]);
for (const server of servers) {
  assert.equal(getStreamingServer(server.id), server);
  const url = new URL(getMovieEmbedUrl(server, '550'));
  assert.equal(url.protocol, 'https:');
  assert.ok(url.href.includes('550'));
  for (const id of ['', '0', '-1', 'abc', '550?ad=1', '550/1', '550#x', '12345678901']) {
    assert.equal(getMovieEmbedUrl(server, id), null);
  }
}
const permissions = new Set(PLAYER_SANDBOX.split(' '));
assert.ok(permissions.has('allow-scripts'));
assert.ok(permissions.has('allow-presentation'));
for (const permission of ['allow-popups', 'allow-popups-to-escape-sandbox', 'allow-top-navigation', 'allow-top-navigation-by-user-activation', 'allow-downloads']) {
  assert.equal(permissions.has(permission), false);
}
console.log('PASS: eight server options, YapGrid default, removed-server fallback, URL validation and popup/navigation restrictions');
