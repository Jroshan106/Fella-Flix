"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import type { Movie } from "@/app/data/movies";
import { useCatalog } from "./useCatalog";
import { CatalogStatus } from "./CatalogStatus";
import FellaPlayer from "./FellaPlayer";
import SeriesPlayer from "./SeriesPlayer";
import { UpcomingBadge } from "./UpcomingBadge";
import { STREAMING_SERVERS, SERVER_STORAGE_KEY, getStreamingServer } from "@/app/data/streaming";

const subscribe = () => () => {};

export default function WatchTitle({ kind = "movie" }: { kind?: "movie" | "series" }) {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, retry } = useCatalog<{ movie: Movie }>(`/api/catalog?id=${encodeURIComponent(id)}&kind=${kind}`);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [activeServer, setActiveServer] = useState(() => {
    try { return getStreamingServer(localStorage.getItem(SERVER_STORAGE_KEY)).id; }
    catch { return STREAMING_SERVERS[0].id; }
  });
  const server = getStreamingServer(activeServer);
  const changeServer = (value: string) => {
    const selected = getStreamingServer(value);
    setActiveServer(selected.id);
    try { localStorage.setItem(SERVER_STORAGE_KEY, selected.id); } catch { /* Storage is optional. */ }
  };
  const nextServer = () => changeServer(STREAMING_SERVERS[(STREAMING_SERVERS.findIndex(item => item.id === server.id) + 1) % STREAMING_SERVERS.length].id);
  if (!mounted) return null;
  if (loading || error) return <CatalogStatus error={error} retry={retry} />;
  const movie = data?.movie;
  if (!movie) return <CatalogStatus error="This title could not be loaded." retry={retry} />;

  return <div data-watch-page className="w-full max-w-7xl mx-auto py-4 sm:py-8">
    <header className="px-4 sm:px-6 mb-4">
      <Link href={kind === "series" ? "/series" : "/movies"} className="inline-flex items-center gap-2 min-h-11 text-sm text-foreground/70 hover:text-primary"><ArrowLeft size={17} />{kind === "series" ? "All series" : "All movies"}</Link>
      <h1 className="text-2xl sm:text-4xl font-black leading-tight mt-1">{movie.title}</h1>
      <p className="mt-2 text-sm text-foreground/65">{movie.release_date.slice(0, 4) || "Date TBA"} · {kind === "series" ? "TV series" : "Movie"} · ★ {movie.vote_average.toFixed(1)}</p>
      <UpcomingBadge releaseDate={movie.release_date} kind={movie.type} className="mt-3" />
    </header>

    <div className="sm:px-6">
      {kind === "series" ? <SeriesPlayer key={id} movie={movie} server={server} onNext={nextServer} /> :
        <FellaPlayer key={id} id={id} title={movie.title} server={server} onNext={nextServer} />}
    </div>

    <section aria-label="Player selection" className="mx-4 sm:mx-6 mt-4 rounded-2xl border border-primary/20 bg-card p-4">
      <label htmlFor="streaming-server" className="block text-sm font-semibold mb-2">Video server</label>
      <select id="streaming-server" value={server.id} onChange={event => changeServer(event.target.value)} className="sm:hidden block w-full min-h-12 rounded-xl border border-primary/30 bg-background px-3 text-foreground">
        {STREAMING_SERVERS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <div className="hidden sm:flex flex-wrap gap-2" role="group" aria-label="Video server">
        {STREAMING_SERVERS.map(item => <button key={item.id} aria-pressed={server.id === item.id} onClick={() => changeServer(item.id)}
          className={`min-h-11 px-4 rounded-xl text-sm font-semibold transition-colors ${server.id === item.id ? "bg-primary text-background" : "bg-background text-foreground hover:bg-primary/15"}`}>{item.name}</button>)}
      </div>
      <p className="text-xs text-foreground/65 mt-3 leading-relaxed">Video not starting? Use Next server in the player or choose another here. Availability varies by provider.</p>
    </section>

    <section className="px-4 sm:px-6 mt-7 max-w-4xl">
      <h2 className="text-lg font-bold mb-3">About {kind === "series" ? "this series" : "this movie"}</h2>
      <p className="text-foreground/75 leading-relaxed">{movie.overview}</p>
      {!!movie.genre_details?.length && <div aria-label="Browse genres" className="flex flex-wrap gap-2 mt-4">{movie.genre_details.map(genre =>
        <Link key={genre.id} href={`/${kind === "series" ? "series" : "movies"}?genres=${genre.id}`}
          className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs hover:bg-primary hover:text-background focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label={`Browse ${genre.name} ${kind === "series" ? "series" : "movies"}`}>{genre.name}</Link>)}</div>}
      <details className="mt-6 text-sm text-foreground/65">
        <summary className="cursor-pointer min-h-11 py-3">Playback help & third-party players</summary>
        <p className="leading-relaxed pb-3">Use Expand player for a larger view, especially in landscape. Reload restarts the selected player. Embedded providers control playback, subtitles, and advertisements. Popups and navigation outside this site are restricted, but ads inside a player may still appear.</p>
      </details>
    </section>
  </div>;
}
