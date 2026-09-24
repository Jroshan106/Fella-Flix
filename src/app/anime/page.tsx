"use client";
import Image from "next/image";

import { mockMovies } from "../data/movies";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, PlayCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 } // faster stagger for large lists
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AnimePage() {
  const [localSearch, setLocalSearch] = useState("");

  // Filter for anime and sort alphabetically
  const allTypeAnime = mockMovies.filter(m => m.type === "anime");
  const sortedMovies = [...allTypeAnime].sort((a, b) => a.title.localeCompare(b.title));

  // Filter based on local search
  const filteredMovies = sortedMovies.filter(movie => 
    movie.title.toLowerCase().includes(localSearch.toLowerCase())
  );


  // Pagination
  const ITEMS_PER_PAGE = 24;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch]);

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            Anime
          </h1>
          <p className="text-foreground/70 mt-2">All anime in alphabetical order ({allTypeAnime.length} total)</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter library..."
            className="block w-full pl-10 pr-3 py-2.5 border border-primary/30 rounded-xl bg-card text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          {paginatedMovies.map((movie) => (
            <motion.div key={movie.id} variants={item}>
              <Link href={`/watch/${movie.id}`} className="group block relative rounded-xl overflow-hidden bg-card shadow-md hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-[2/3] relative bg-black">
                  <Image src={movie.poster_path} alt={movie.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <PlayCircle className="w-10 h-10 text-primary mx-auto mb-2 transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
                <div className="p-3 relative z-10 bg-card">
                  <h3 className="font-bold text-card-foreground truncate text-sm" title={movie.title}>{movie.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-card-foreground/70">{movie.release_date.split('-')[0]}</span>
                    <div className="flex items-center text-primary">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      <span className="text-[10px] font-semibold">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-card border border-primary/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-foreground font-medium"
            >
              Previous
            </button>
            <span className="text-foreground/70 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-card border border-primary/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-foreground font-medium"
            >
              Next
            </button>
          </div>
        )}

      </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img src="/images/no-results.png" alt="No Results" className="w-40 h-auto mb-6 drop-shadow-xl" />
          <p className="text-foreground/60 text-lg font-medium">No anime found matching "{localSearch}".</p>
        </div>
      )}
    </div>
  );
}
