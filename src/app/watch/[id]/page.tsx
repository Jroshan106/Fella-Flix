"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import type { Movie } from "@/app/data/movies";
import { useCatalog } from "@/app/components/useCatalog";
import { CatalogStatus } from "@/app/components/CatalogStatus";
import { ArrowLeft, Server } from "lucide-react";
import FellaPlayer from "@/app/components/FellaPlayer";
import { STREAMING_SERVERS, SERVER_STORAGE_KEY, getStreamingServer } from "@/app/data/streaming";



const subscribe = () => () => {};

export default function WatchMovie() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { data, error, loading, retry } = useCatalog<{ movie: Movie }>(`/api/catalog?id=${encodeURIComponent(id)}`);
  const movie = data?.movie;
  // Existing player providers require numeric TMDB IDs; OMDb uses IMDb IDs.
  const hasPlayer = /^[1-9]\d{0,9}$/.test(id);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [activeServer, setActiveServer] = useState(() => {
    try { return getStreamingServer(localStorage.getItem(SERVER_STORAGE_KEY)).id; }
    catch { return STREAMING_SERVERS[0].id; }
  });
  const server = getStreamingServer(activeServer);
  const handleServerChange = (serverId: typeof activeServer) => {
    setActiveServer(serverId);
    try { localStorage.setItem(SERVER_STORAGE_KEY, serverId); } catch { /* Storage is optional. */ }
  };
  const nextServer = () => {
    const index = STREAMING_SERVERS.findIndex(item => item.id === server.id);
    handleServerChange(STREAMING_SERVERS[(index + 1) % STREAMING_SERVERS.length].id);
  };

  if (!mounted) return null;
  if (loading || error) return <CatalogStatus error={error} retry={retry} />;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background flex flex-col">
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={movie ? {
          backgroundImage: `url(${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)'
        } : undefined} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 flex-grow flex flex-col">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center text-foreground/70 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to browsing
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-grow flex flex-col"
        >
          {movie && (
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">{movie.title}</h1>
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {movie.genres.map((g: string) => (
                    <span key={g} className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full border border-primary/20">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-foreground/70 max-w-3xl">{movie.overview}</p>
            </div>
          )}

          {hasPlayer && STREAMING_SERVERS.length > 1 && (<div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">
            <div className="flex items-center text-card-foreground/70 mr-2">
              <Server className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Choose player:</span>
            </div>
            {STREAMING_SERVERS.map((server) => (
              <button
                key={server.name}
                aria-pressed={activeServer === server.id}
                onClick={() => handleServerChange(server.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeServer === server.id
                    ? "bg-primary text-background shadow-md scale-105" 
                    : "bg-background text-foreground hover:bg-primary/20"
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>)}

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-primary/20 flex-grow max-h-[80vh]">
            {hasPlayer ? <FellaPlayer key={`${id}-${server.id}`} id={id} title={movie?.title || "Movie"} server={server} onNext={nextServer} /> :
              <p role="status" className="p-8 text-center text-white/70">Movie information is available, but a player is not available for this title.</p>}
          </div>
          
          {hasPlayer && <div className="text-center text-sm text-foreground/50 mt-6 pb-8 space-y-2">
            <p>Popups and page redirects are blocked. If a server stalls, choose Next server.</p>
            <p className="text-xs">No server is guaranteed ad-free. Try another if you see an overlay or playback fails.</p>
            <p className="text-xs">Playback controls are supplied by the selected provider inside the FellaFLIX player.</p>
          </div>}
        </motion.div>
      </div>
    </div>
  );
}
