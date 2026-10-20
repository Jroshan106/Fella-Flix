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
const tmdb = load('src/lib/tmdb.ts', { 'server-only': {} });
const omdb = load('src/lib/omdb.ts', { 'server-only': {}, './tmdb': tmdb });
const catalog = load('src/lib/catalog.ts', { 'server-only': {}, './tmdb': tmdb, './omdb': omdb });
const route = load('src/app/api/catalog/route.ts', { '@/lib/catalog': catalog });
const { NextRequest } = require('next/server');
const request = query => new NextRequest(`http://localhost/api/catalog?${query}`);
const fixture = { Response: 'True', imdbID: 'tt0111161', Title: 'Fixture Movie', Year: '1994', Type: 'movie', Poster: 'https://m.media-amazon.com/images/test.jpg', Plot: 'A test plot.', Genre: 'Drama', imdbRating: '9.3' };
const original = { fetch: global.fetch, key: process.env.OMDB_API_KEY, token: process.env.TMDB_API_READ_ACCESS_TOKEN, tmdbKey: process.env.TMDB_API_KEY };
const calls = [];
function mock() {
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    assert.equal(url.origin, 'https://www.omdbapi.com');
    assert.equal(url.searchParams.get('apikey'), 'fixture-secret');
    assert.equal(url.searchParams.get('type'), 'movie');
    assert.equal(options.next.revalidate, 86400);
    if (url.searchParams.has('s')) return Response.json({ Response: 'True', totalResults: '1500', Search: [{ imdbID: fixture.imdbID, Title: fixture.Title, Year: '1994', Poster: 'N/A', Type: 'movie' }] });
    return Response.json({ ...fixture, imdbID: url.searchParams.get('i') });
  };
}
(async () => {
  delete process.env.OMDB_API_KEY;
  delete process.env.TMDB_API_READ_ACCESS_TOKEN;
  delete process.env.TMDB_API_KEY;
  global.fetch = async () => { throw Error('Should not fetch'); };
  assert.equal((await route.GET(request(''))).status, 503);
  assert.equal((await route.GET(request('id=tt0111161'))).status, 503);
  process.env.OMDB_API_KEY = 'fixture-secret';
  process.env.TMDB_API_READ_ACCESS_TOKEN = 'tmdb-secret';
  assert.equal(catalog.getCatalogProvider(), 'omdb');
  const genres = await route.GET(request('view=genres'));
  assert.deepEqual(await genres.json(), { genres: [], provider: 'omdb' });
  mock();
  let response = await route.GET(request('q=Test%20%26%20Movie&page=2'));
  assert.equal(response.status, 200);
  let body = await response.json();
  assert.equal(body.page, 2);
  assert.equal(body.total_pages, 100);
  assert.equal(body.results[0].id, fixture.imdbID);
  assert.equal(body.results[0].poster_path, '/images/no-results.png');
  assert.equal(body.results[0].has_rating, false);
  assert.equal(calls.at(-1).url.searchParams.get('s'), 'Test & Movie');
  response = await route.GET(request('id=tt0111161'));
  body = await response.json();
  assert.equal(body.movie.overview, fixture.Plot);
  assert.equal(body.movie.vote_average, 9.3);
  assert.equal(body.movie.has_rating, true);
  assert.equal(body.movie.poster_path, fixture.Poster);
  assert.equal(calls.at(-1).url.searchParams.get('plot'), 'full');
  response = await route.GET(request('view=home'));
  body = await response.json();
  assert.equal(body.movies.length, 10);
  assert.equal(body.anime.length, 10);
  assert.equal(body.anime[0].type, 'anime');
  for (const query of ['page=0', 'page=101', 'page=2', 'kind=tv', 'genres=16', 'kind=anime&q=test', 'id=tt1', 'id=tt0111161/credits', 'q=' + 'a'.repeat(201)]) {
    assert.equal((await route.GET(request(query))).status, 400, query);
  }
  // Numeric bookmarks keep using TMDB even when OMDb is enabled.
  global.fetch = async url => {
    assert.equal(url.origin, 'https://api.themoviedb.org');
    return Response.json({ id: 550, title: 'TMDB bookmark' });
  };
  assert.equal((await route.GET(request('id=550'))).status, 200);
  for (const [error, status] of [['Invalid API key! fixture-secret', 503], ['Request limit reached! fixture-secret', 429], ['Too many results.', 400]]) {
    global.fetch = async () => Response.json({ Response: 'False', Error: error });
    response = await route.GET(request('q=test'));
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.text()).includes('fixture-secret'), false);
  }
  global.fetch = async () => Response.json({ Response: 'False', Error: 'Movie not found!' });
  response = await route.GET(request('q=unknown'));
  assert.deepEqual((await response.json()).results, []);
  assert.equal((await route.GET(request('id=tt0111161'))).status, 404);
  for (const upstream of [401, 403, 429, 500]) {
    global.fetch = async () => new Response('fixture-secret', { status: upstream });
    response = await route.GET(request('id=tt0111161'));
    assert.equal(response.status, upstream === 429 ? 429 : upstream === 500 ? 502 : 503);
    assert.equal((await response.text()).includes('fixture-secret'), false);
  }
  for (const invalid of [{}, null, { Response: 'True', Search: null }, { Response: 'True', Search: [], totalResults: 'bad' }]) {
    global.fetch = async () => Response.json(invalid);
    assert.equal((await route.GET(request('q=test'))).status, 502);
  }
  global.fetch = async () => new Response('not json');
  assert.equal((await route.GET(request('q=test'))).status, 502);
  global.fetch = async () => { throw Error('fixture-secret'); };
  response = await route.GET(request('q=test'));
  assert.equal(response.status, 502);
  assert.equal((await response.text()).includes('fixture-secret'), false);
  console.log('PASS: OMDb selection, search, pagination, details, featured lists, IMDb IDs, bookmarks, validation and safe errors');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = original.fetch;
  for (const [name, value] of [['OMDB_API_KEY', original.key], ['TMDB_API_READ_ACCESS_TOKEN', original.token], ['TMDB_API_KEY', original.tmdbKey]]) {
    if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
});
