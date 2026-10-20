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
const { STREAMING_SERVERS: servers, getStreamingServer, getMovieEmbedUrl, getSeriesEmbedUrl, PLAYER_SANDBOX } = config.exports;
assert.equal(servers.length, 5);
assert.equal(new Set(servers.map(s => s.id)).size, 5);
assert.equal(servers[0].id, 'yapgrid');
assert.equal(getStreamingServer('peestream').id, 'yapgrid');
assert.deepEqual(servers.map(s => s.id), ['yapgrid', 'nexus', 'nexus-multi', 'vidcore', 'vidlink']);
for (const removed of ['phantom', 'vidfast', 'videasy']) assert.equal(getStreamingServer(removed), servers[0]);
assert.equal(getStreamingServer('0'), servers[0]);
assert.equal(getStreamingServer('superembed'), servers[0]);
assert.equal(getStreamingServer(null), servers[0]);
for (const server of servers) {
  assert.equal(getStreamingServer(server.id), server);
  const url = new URL(getMovieEmbedUrl(server, '550'));
  assert.equal(url.protocol, 'https:');
  assert.ok(url.href.includes('550'));
  const tvUrl = new URL(getSeriesEmbedUrl(server, '1396', 2, 3));
  assert.equal(tvUrl.protocol, 'https:');
  assert.ok(tvUrl.pathname.endsWith('/tv/1396/2/3'));
  assert.equal(tvUrl.origin, url.origin);
  assert.ok(getSeriesEmbedUrl(server, '1396', 0, 1));
  for (const [season, episode] of [[-1, 1], [1, 0], [NaN, 1], [1, Infinity], [1.5, 1], [1, 2.5], [10000, 1]]) {
    assert.equal(getSeriesEmbedUrl(server, '1396', season, episode), null);
  }
  for (const id of ['', '0', '-1', 'abc', '550?ad=1', '550/1', '550#x', '12345678901']) {
    assert.equal(getMovieEmbedUrl(server, id), null);
    assert.equal(getSeriesEmbedUrl(server, id, 1, 1), null);
  }
}
const permissions = new Set(PLAYER_SANDBOX.split(' '));
assert.ok(permissions.has('allow-scripts'));
assert.ok(permissions.has('allow-presentation'));
for (const permission of ['allow-popups', 'allow-popups-to-escape-sandbox', 'allow-top-navigation', 'allow-top-navigation-by-user-activation', 'allow-downloads']) {
  assert.equal(permissions.has(permission), false);
}
console.log('PASS: five server options, YapGrid default, removed-server fallback, URL validation and popup/navigation restrictions');
