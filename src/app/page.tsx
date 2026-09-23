"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { mockMovies } from "./data/movies";
import { Star, PlayCircle } from "lucide-react";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const movies = mockMovies.filter(m => m.type === "movie").slice(0, 10);
  const anime = mockMovies.filter(m => m.type === "anime").slice(0, 10);

  const MovieGrid = ({ title, items, viewAllLink }: { title: string, items: typeof mockMovies, viewAllLink?: string }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-primary font-semibold hover:underline text-sm mr-2">
            View All →
          </Link>
        )}
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {items.map((movie) => (
          <motion.div key={movie.id} variants={item}>
            <Link href={`/watch/${movie.id}`} className="group block relative rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[2/3] relative">
                <img 
                  src={movie.poster_path} 
                  alt={movie.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <PlayCircle className="w-12 h-12 text-primary mx-auto mb-4 transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                  <p className="text-white text-sm line-clamp-3 mb-2">{movie.overview}</p>
                </div>
              </div>
              <div className="p-4 relative z-10 bg-card">
                <h3 className="font-bold text-card-foreground truncate" title={movie.title}>{movie.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-card-foreground/70">{movie.release_date.split('-')[0]}</span>
                  <div className="flex items-center text-primary">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter">
          Welcome to <span className="text-primary">FellaFLIX</span>
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover popular blockbusters, critically acclaimed masterpieces, the best of anime and more.
        </p>
      </motion.div>

      <MovieGrid title="Featured Movies" items={movies} viewAllLink="/all" />
      <MovieGrid title="Trending Anime" items={anime} viewAllLink="/all" />
      
      <div className="text-center mt-8">
        <Link href="/all" className="inline-block px-8 py-4 bg-primary text-background font-black rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
          BROWSE FULL LIBRARY
        </Link>
      </div>
    </div>
  );
}
