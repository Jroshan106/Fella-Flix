const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
function load(file, overrides = {}) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  const original = mod.require.bind(mod);
  mod.require = id => id in overrides ? overrides[id] : original(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
  return mod.exports;
}
const api = load('src/lib/tmdb.ts', { 'server-only': {} });
const route = load('src/app/api/catalog/route.ts', { '@/lib/tmdb': api });
const { NextRequest } = require('next/server');
const fixture = { id: 550, title: 'Fixture Movie', genre_ids: [16], original_language: 'ja', adult: false };
const nativeFetch = global.fetch;
const originalToken = process.env.TMDB_API_READ_ACCESS_TOKEN;
const originalKey = process.env.TMDB_API_KEY;
const calls = [];
const request = query => new NextRequest(`http://localhost/api/catalog?${query}`);
function mock() {
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.pathname.endsWith('/genre/movie/list')) return Response.json({ genres: [{ id: 16, name: 'Animation' }] });
    if (url.pathname.endsWith('/movie/550')) return Response.json(fixture);
    return Response.json({ results: [fixture], total_pages: 900, total_results: 18000 });
  };
}
(async () => {
  delete process.env.TMDB_API_READ_ACCESS_TOKEN;
  delete process.env.TMDB_API_KEY;
  global.fetch = async () => { throw Error('Unexpected fetch'); };
  assert.equal((await route.GET(request(''))).status, 503);
  process.env.TMDB_API_READ_ACCESS_TOKEN = 'fixture-token';
  mock();
  let result = await api.getCatalog(new URLSearchParams({ page: '2', genres: '16,28' }));
  assert.equal(result.total_pages, 500);
  assert.equal(result.page, 2);
  assert.equal(result.results[0].poster_path, '/images/no-results.png');
  assert.equal(result.results[0].backdrop_path, '');
  assert.equal(result.results[0].vote_average, 0);
  assert.equal(result.results[0].type, 'anime');
  assert.deepEqual(result.results[0].genres, ['Animation']);
  assert.equal(calls.at(-1).url.searchParams.get('with_genres'), '16|28');
  assert.equal(calls.at(-1).options.headers.Authorization, 'Bearer fixture-token');
  assert.equal(calls.at(-1).options.next.revalidate, 900);
  assert.equal(calls.at(-1).url.searchParams.has('api_key'), false);
  await api.getCatalog(new URLSearchParams({ q: 'Test & movie' }));
  assert.equal(calls.at(-1).url.pathname, '/3/search/movie');
  assert.equal(calls.at(-1).url.searchParams.get('query'), 'Test & movie');
  await api.getCatalog(new URLSearchParams({ kind: 'anime' }));
  assert.equal(calls.at(-1).url.searchParams.get('with_original_language'), 'ja');
  assert.equal(calls.at(-1).url.searchParams.get('with_genres'), '16');
  for (const query of ['page=0', 'page=501', 'page=abc', 'kind=tv', 'genres=bad', 'q=x&genres=16', 'kind=anime&q=x']) {
    assert.equal((await route.GET(request(query))).status, 400);
  }
  for (const id of ['0', '-1', '550/credits', 'abc']) {
    assert.equal((await route.GET(request(`id=${encodeURIComponent(id)}`))).status, 400);
  }
  result = await route.GET(request('id=550'));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).movie.title, 'Fixture Movie');
  result = await route.GET(request('view=home'));
  const home = await result.json();
  assert.equal(home.movies.length, 1);
  assert.equal(home.anime.length, 1);
  delete process.env.TMDB_API_READ_ACCESS_TOKEN;
  process.env.TMDB_API_KEY = 'fixture-key';
  await api.getMovie('550');
  assert.equal(calls.at(-1).url.searchParams.get('api_key'), 'fixture-key');
  assert.equal(calls.at(-1).options.headers.Authorization, undefined);
  for (const [upstream, expected] of [[401, 503], [403, 503], [404, 404], [429, 429], [500, 502]]) {
    global.fetch = async () => new Response('private upstream fixture-key', { status: upstream });
    result = await route.GET(request('id=550'));
    assert.equal(result.status, expected);
    assert.equal((await result.text()).includes('fixture-key'), false);
    assert.equal(result.headers.get('cache-control'), 'no-store');
  }
  global.fetch = async () => { throw new DOMException('fixture-key', 'TimeoutError'); };
  assert.equal((await route.GET(request('id=550'))).status, 502);
  global.fetch = async () => Response.json({ results: null });
  assert.equal((await route.GET(request(''))).status, 502);
  global.fetch = async () => Response.json({ ...fixture, adult: true });
  assert.equal((await route.GET(request('id=550'))).status, 404);
  console.log('PASS: TMDB auth, filters, pagination, mapping, details, home, validation and safe error handling');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = nativeFetch;
  if (originalToken === undefined) delete process.env.TMDB_API_READ_ACCESS_TOKEN;
  else process.env.TMDB_API_READ_ACCESS_TOKEN = originalToken;
  if (originalKey === undefined) delete process.env.TMDB_API_KEY;
  else process.env.TMDB_API_KEY = originalKey;
});
