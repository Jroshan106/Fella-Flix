"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Search, ArrowRight } from "lucide-react";

export default function WatchById() {
  const [tmdbId, setTmdbId] = useState("");
  const router = useRouter();

  const handleWatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tmdbId.trim()) {
      router.push(`/watch/${tmdbId.trim()}`);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-primary/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Film className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Watch Any Movie</h1>
          <p className="text-card-foreground/70 text-sm">
            Got a TMDB ID? Enter it below to start streaming immediately via Vidcore.
          </p>
        </div>

        <form onSubmit={handleWatch} className="space-y-6">
          <div>
            <label htmlFor="tmdbId" className="block text-sm font-medium text-card-foreground mb-2">
              TMDB Movie ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-card-foreground/40" />
              </div>
              <input
                type="text"
                id="tmdbId"
                value={tmdbId}
                onChange={(e) => setTmdbId(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-primary/30 rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g. 157336 for Interstellar"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!tmdbId.trim()}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Start Watching
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-card-foreground/50">
          <p>Don't know the ID? Go to <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TMDB</a>, search for a movie, and find the number in the URL.</p>
        </div>
      </motion.div>
    </div>
  );
}
