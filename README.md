# FellaFLIX 

Welcome to **FellaFLIX** — a beautifully designed, "movie nerd" style streaming platform. Built for cinema enthusiasts, FellaFLIX provides a sleek, dark-themed cinematic interface to discover and watch your favorite movies and TV series.

### Live Demo
Check out the live website here: **[https://fellaflix.vercel.app/](https://fellaflix.vercel.app/)**

## TMDB setup

Set `TMDB_API_READ_ACCESS_TOKEN` (or `TMDB_API_KEY`) in `.env.local` and in your Vercel environment variables. Restart locally or redeploy after setting it. See [setup instructions](docs/tmdb-catalog.md). The static movie list has been removed; a credential is required to load movies.

## How It Works

FellaFLIX uses a Next.js interface, the TMDB API for its live movie catalog, and third-party video players. It does not host video files or media content on its own servers.

We utilize free, third-party **Streaming APIs** (such as Vidcore, Vidsrc, and AutoEmbed) to embed video players seamlessly into our application. By passing a movie's TMDB (The Movie Database) ID to these APIs, the player automatically serves the corresponding stream.

## FellaFLIX Player integration

The watch page offers eight server options across seven providers in a shared FellaFLIX player shell, with reload, next-server and fullscreen controls. SuperEmbed is no longer offered on the watch page. Its API route remains for backwards compatibility.

The iframe sandbox permits scripts, same-origin functionality and presentation, but does not permit popups, top-level navigation, forms or downloads. This blocks popup windows and redirects out of the site; it does not remove advertisements inside a cross-origin player. Some providers may reject sandboxing. Switch servers if that happens; the app does not automatically loosen protection.

Provider choices are stored by stable ID under a new storage key, so legacy SuperEmbed preferences cannot select the wrong server. Invalid movie IDs never load an embed.

These are provider-owned players inside a custom FellaFLIX shell. Native playback controls require a documented direct MP4/HLS API; the selected integrations do not provide that contract. No ad-free or full-playback guarantee is made.

See [provider research and verification](docs/streaming-providers.md). Run `node test-players.cjs` for provider configuration, URL validation and sandbox checks, and `node test-streaming.cjs` for the legacy resolver tests.

## Features

- **Cinematic UI:** A highly polished, responsive grid layout built with Tailwind CSS, featuring smooth page transitions powered by Framer Motion.
- **Dark/Light Mode:** Full theme support tailored for late-night binge-watching or daytime browsing.
- **Multiple Streaming Servers:** Because third-party streaming APIs can be unreliable or riddled with ads, we provide an instant "Server Switcher" so users can hop between providers (Vidcore, Vidsrc, etc.) if one goes down.
- **Request a Movie:** A dedicated public page for users to submit requests for movies they want added to the library.
- **Admin Panel:** The protected `/admin` page manages movie requests. Catalog metadata updates automatically from TMDB.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Catalog:** Official TMDB API, with server-side credentials and caching.

## ⚠️ Disclaimer

FellaFLIX is a UI concept and educational project. **I do not host, upload, or control any of the video content.** All media is streamed directly from third-party APIs and services. We highly recommend using an ad-blocker (like uBlock Origin or the Brave Browser) when interacting with free third-party embeds to prevent intrusive popups.
