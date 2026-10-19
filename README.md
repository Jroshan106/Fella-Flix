# FellaFLIX 

Welcome to **FellaFLIX** — a beautifully designed, "movie nerd" style streaming platform. Built for cinema enthusiasts, FellaFLIX provides a sleek, dark-themed cinematic interface to discover and watch your favorite movies and anime.

### Live Demo
Check out the live website here: **[https://fellaflix.vercel.app/](https://fellaflix.vercel.app/)**

## How It Works

FellaFLIX uses a Next.js interface and a server-side player resolver. It does not host video files or media content on its own servers.

We utilize free, third-party **Streaming APIs** (such as Vidcore, Vidsrc, and AutoEmbed) to embed video players seamlessly into our application. By passing a movie's TMDB (The Movie Database) ID to these APIs, the player automatically serves the corresponding stream.

## FellaFLIX Player integration

The watch page now defaults to a FellaFLIX-branded SuperEmbed player for new visitors. Existing saved server preferences are preserved. Select **FellaFLIX Player** in the player selector to use it.

- No API key is required. The server calls `https://getsuperembed.link/` with the movie's TMDB ID and FellaFLIX colors.
- `GET /api/superembed?id=550&format=json` resolves the player URL; omitting `format=json` redirects to the player for iframe compatibility.
- Invalid IDs return 400. Provider errors, invalid URLs, and requests exceeding 12 seconds return 502 with a retry message. Responses are not cached because player URLs may expire.
- The resolver accepts HTTPS player URLs on `streamingnow.mov`, the host verified during integration. If SuperEmbed changes its player domain, verify the new host before updating the allowlist.
- This is a branded wrapper around a third-party iframe, not a native MP4/HLS player. Playback, available titles, controls, and advertisements remain controlled by the provider. The other servers remain available if a stream fails.

Provider documentation: [SuperEmbed installation guide](https://superembed.stream/) and [API limitations](https://www.superembed.stream/movie-streaming-api.html).

Run `node test-streaming.cjs` to verify ID validation, player URL validation, JSON and redirect responses, and upstream failure handling without contacting the provider.

## Features

- **Cinematic UI:** A highly polished, responsive grid layout built with Tailwind CSS, featuring smooth page transitions powered by Framer Motion.
- **Dark/Light Mode:** Full theme support tailored for late-night binge-watching or daytime browsing.
- **Multiple Streaming Servers:** Because third-party streaming APIs can be unreliable or riddled with ads, we provide an instant "Server Switcher" so users can hop between providers (Vidcore, Vidsrc, etc.) if one goes down.
- **Request a Movie:** A dedicated public page for users to submit requests for movies they want added to the library.
- **Hidden Admin Panel:** A secure, unlisted `/admin` dashboard that allows site administrators to quickly append new movies to the database via TMDB IDs.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Database:** Local JSON File (`movies.json`)

## ⚠️ Disclaimer

FellaFLIX is a UI concept and educational project. **I do not host, upload, or control any of the video content.** All media is streamed directly from third-party APIs and services. We highly recommend using an ad-blocker (like uBlock Origin or the Brave Browser) when interacting with free third-party embeds to prevent intrusive popups.
