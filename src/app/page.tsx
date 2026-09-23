"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const movies = mockMovies.filter(m => m.type === "movie").slice(0, 10);
  const anime = mockMovies.filter(m => m.type === "anime").slice(0, 10);
  const sliderMovies = mockMovies.filter(m => m.backdrop_path && m.backdrop_path.includes("tmdb.org")).slice(0, 5);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliderMovies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderMovies.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {sliderMovies.length > 0 && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-primary/20 group">
          {sliderMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
              style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
            >
              <img 
                src={movie.backdrop_path} 
                alt={movie.title} 
                className="w-full h-full object-cover transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tighter"
                >
                  {movie.title}
                </motion.h1>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4 mb-4 text-white/90 font-medium"
                >
                  <span className="flex items-center text-primary"><Star className="w-5 h-5 mr-1 fill-current" /> {movie.vote_average.toFixed(1)}</span>
                  <span>{movie.release_date.split('-')[0]}</span>
                  <span className="px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-xs uppercase tracking-wider">{movie.type}</span>
                </motion.div>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm md:text-base line-clamp-3 mb-8 max-w-xl drop-shadow"
                >
                  {movie.overview}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href={`/watch/${movie.id}`} className="inline-flex items-center px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/30">
                    <PlayCircle className="w-5 h-5 mr-2" /> Watch Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          <div className="absolute bottom-6 right-6 z-10 flex space-x-2">
            {sliderMovies.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-primary scale-125' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      <MovieGrid title="Featured Movies" items={movies} viewAllLink="/movies" />
      <MovieGrid title="Trending Anime" items={anime} viewAllLink="/anime" />
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Link href="/movies" className="w-full sm:w-auto px-8 py-4 bg-primary text-background font-black rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 text-center">
          BROWSE MOVIES
        </Link>
        <Link href="/anime" className="w-full sm:w-auto px-8 py-4 bg-card text-foreground font-black rounded-full border-2 border-primary/20 hover:border-primary/60 hover:scale-105 transition-all shadow-lg text-center">
          BROWSE ANIME
        </Link>
      </div>
    </div>
  );
}
