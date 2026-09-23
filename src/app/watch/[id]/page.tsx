"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mockMovies } from "@/app/data/movies";
import { ArrowLeft, Server } from "lucide-react";

const SERVERS = [
  { name: "Server 1 (Stellar)", url: (id: string) => `https://stellar.gdn/embed/movie/${id}` },
  { name: "Server 2 (Cinezo)", url: (id: string) => `https://cinezo.org/embed/movie/${id}` },
  { name: "Server 3 (NHD Embed)", url: (id: string) => `https://nhdapi.com/embed/movie/${id}` },
  { name: "Server 4 (CineSrc)", url: (id: string) => `https://cinesrc.to/embed/movie/${id}` },
];

export default function WatchMovie() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const movie = mockMovies.find(m => m.id.toString() === id);
  const [mounted, setMounted] = useState(false);
  const [activeServer, setActiveServer] = useState(0);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

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
              <p className="text-foreground/70 max-w-3xl">{movie.overview}</p>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">
            <div className="flex items-center text-card-foreground/70 mr-2">
              <Server className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Change Server (If too many ads):</span>
            </div>
            {SERVERS.map((server, idx) => (
              <button
                key={server.name}
                onClick={() => setActiveServer(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeServer === idx 
                    ? "bg-primary text-background shadow-md scale-105" 
                    : "bg-background text-foreground hover:bg-primary/20"
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-primary/20 flex-grow max-h-[80vh]">
            <iframe
              src={SERVERS[activeServer].url(id)}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title="Movie Player"
            />
          </div>
          
          <div className="text-center text-sm text-foreground/50 mt-6 pb-8 space-y-2">
            <p>Streaming provided by third-party APIs. FellaFLIX does not host or own these files.</p>
            <p className="text-xs max-w-2xl mx-auto">
              <strong>Desktop Tip:</strong> We strongly recommend using an adblocker like <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">uBlock Origin</a> to block intrusive popups.
            </p>
            <p className="text-xs max-w-2xl mx-auto">
              <strong>Mobile Tip:</strong> Use the <a href="https://brave.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Brave Browser</a> on your phone for a seamless, ad-free streaming experience!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
