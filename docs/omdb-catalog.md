# OMDb catalog setup

1. Request and activate a key at https://www.omdbapi.com/apikey.aspx.
2. Set `OMDB_API_KEY=your_activated_key` in the root `.env.local` and restart the development server.
3. Add `OMDB_API_KEY` in Vercel Project Settings → Environment Variables for Production (and Preview if needed), then redeploy. A local env file does not configure Vercel.

Keep the key server-side; do not use a `NEXT_PUBLIC_` prefix or commit it. When `OMDB_API_KEY` is nonempty, browsing and search use OMDb. Otherwise the existing TMDB integration is used. Both providers' credentials can coexist; numeric bookmarked movie IDs still use TMDB and `tt…` IMDb IDs use OMDb.

OMDb provides title search and IMDb ID/title lookups, not popular, genre discovery, or anime discovery endpoints. Home and unfiltered Movies/Anime pages therefore fetch metadata for curated IMDb ID selections. They are labeled featured selections, not a complete or popularity-ranked catalog. Search uses OMDb's movie-only search, ten results per page, up to 100 pages. Genre filtering is hidden for OMDb. Search results do not include ratings or plots; opening the details page fetches those. Missing posters use the local placeholder. OMDb has no backdrop images, so the home backdrop carousel is omitted.

OMDb supplies metadata, not video streams. Existing embedded player providers accept TMDB IDs; IMDb-only OMDb detail pages show a player-unavailable message rather than sending an incorrect ID to those players. Connecting OMDb alone does not add playback.

Successful upstream fetches use Next.js's cache with a one-day revalidation interval to conserve quota. Home requests metadata for 20 featured IDs, reused by the corresponding browse/detail requests. OMDb may return errors with HTTP 200; invalid keys, quota limits, missing titles, invalid JSON, and network failures are handled without exposing credentials or raw upstream responses. No-results searches return an empty catalog.

Validation: `node test-omdb.cjs`, `node test-tmdb.cjs`, `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/next/dist/bin/next build`. The tests mock OMDb; live validation requires an activated key.

Reference: https://www.omdbapi.com/.
