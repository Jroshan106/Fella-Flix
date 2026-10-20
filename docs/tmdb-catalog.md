# TMDB catalog setup

OMDb is also supported and takes precedence for browsing/search when `OMDB_API_KEY` is set. See [OMDb setup and limitations](omdb-catalog.md).

The catalog is now loaded from the official TMDB v3 API. The old `src/app/data/movies.json` list and manual catalog editing have been removed from the application. There is no static fallback.

## Credentials

1. Get an API Read Access Token from https://www.themoviedb.org/settings/api.
2. Add `TMDB_API_READ_ACCESS_TOKEN=your_token` to the root `.env.local`. Alternatively set `TMDB_API_KEY` to a v3 API key. If both are set, the read token takes precedence.
3. Restart the local development server.
4. Add the same variable in Vercel Project Settings → Environment Variables for the environments you deploy to, then redeploy.

Do not use a `NEXT_PUBLIC_` prefix or commit credentials. `.env.example` contains names only. Missing credentials return HTTP 503 and a retryable message; they do not prevent a production build.

## Behavior

- Home: popular movies and Japanese animated films.
- Movies: popular movies, TMDB title search, genre filters and API pagination (up to TMDB's 500-page limit).
- Search: uses `/search/movie`, including translated and alternate titles. Genre filters are hidden while searching because that endpoint does not support discover filters.
- Anime: `/discover/movie` with animation genre 16 and Japanese original language. This is a movie-only approximation of anime, not a TV-series catalog.
- Watch pages: `/movie/{id}` provides title, artwork and genres. Existing streaming server selection uses the same movie ID.
- TMDB supplies metadata, not video streams; catalog presence does not guarantee playback on a third-party server.
- Successful upstream responses are cached for 15 minutes; requests time out after 10 seconds. Errors never expose upstream URLs, credentials or raw error bodies.
- `/admin` now manages requests only. The existing filesystem-based request workflow remains unchanged and requires separate persistent storage for reliable writes on Vercel.
- Old root-level import/maintenance scripts are legacy utilities and are no longer part of the app or npm scripts. Do not run them to populate the live catalog.

## Validation

Run `node test-tmdb.cjs`, `node node_modules/typescript/bin/tsc --noEmit`, and `npm run build`.
Tests use mocked API responses and require no credentials. Live API validation requires your own token.

References: [authentication](https://developer.themoviedb.org/docs/authentication-application), [movie discovery](https://developer.themoviedb.org/reference/discover-movie), [attribution](https://developer.themoviedb.org/docs/faq).
