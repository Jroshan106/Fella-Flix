# FellaFLIX 

Welcome to **FellaFLIX** — a beautifully designed, "movie nerd" style streaming platform. Built for cinema enthusiasts, FellaFLIX provides a sleek, dark-themed cinematic interface to discover and watch your favorite movies and anime.

### Live Demo
Check out the live website here: **[https://fellaflix.vercel.app/](https://fellaflix.vercel.app/)**

---

<<<<<<< HEAD
## How It Works
=======
Open https://fellaflix.vercel.app/ with your browser to see the result.
>>>>>>> 0790acc6e8291a9b0fbfd0e79ba131b41d6ce21b

FellaFLIX is entirely front-end driven and does not host any video files or media content on its own servers. Instead, we act as a sleek aggregator UI. 

We utilize free, third-party **Streaming APIs** (such as Vidcore, Vidsrc, and AutoEmbed) to embed video players seamlessly into our application. By passing a movie's TMDB (The Movie Database) ID to these APIs, the player automatically serves the corresponding stream.

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

FellaFLIX is a UI concept and educational project. **We do not host, upload, or control any of the video content.** All media is streamed directly from third-party APIs and services. We highly recommend using an ad-blocker (like uBlock Origin or the Brave Browser) when interacting with free third-party embeds to prevent intrusive popups.
