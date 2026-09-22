"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mockMovies } from "@/app/data/movies";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WatchMovie() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const movie = mockMovies.find(m => m.id.toString() === id);
  const [mounted, setMounted] = useState(false);

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
          className="mb-6"
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

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-primary/20 flex-grow max-h-[80vh]">
            <iframe
              src={`https://vidcore.org/embed/movie/${id}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title="Movie Player"
              sandbox="allow-same-origin allow-scripts allow-presentation"
            />
          </div>
          
          <p className="text-center text-sm text-foreground/50 mt-6 pb-8">
            Streaming provided by Vidcore API. Enjoy the movie!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
