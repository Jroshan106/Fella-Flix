"use client";
import Image from "next/image";

import { useSearchParams } from "next/navigation";
import { mockMovies } from "../data/movies";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, PlayCircle, SearchX, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(query);

  const results = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query) || 
    movie.overview.toLowerCase().includes(query)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      
      {/* Local Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-foreground/40" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search for another movie..."
          className="block w-full pl-12 pr-4 py-4 border border-primary/30 rounded-2xl bg-card text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg text-lg transition-all"
        />
        <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors">
          Search
        </button>
      </form>

      <div className="mb-8 border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold text-foreground">
          Search Results for <span className="text-primary">"{query}"</span>
        </h1>
        <p className="text-foreground/70 mt-2">Found {results.length} movies</p>
      </div>

      {results.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {results.map((movie) => (
            <motion.div key={movie.id} variants={item}>
              <Link href={`/watch/${movie.id}`} className="group block relative rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[2/3] relative bg-black">
                  <Image src={movie.poster_path} alt={movie.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <PlayCircle className="w-12 h-12 text-primary mx-auto mb-4 transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                    <p className="text-white text-xs line-clamp-3 mb-2">{movie.overview}</p>
                  </div>
                </div>
                <div className="p-4 relative z-10 bg-card">
                  <h3 className="font-bold text-card-foreground truncate text-sm" title={movie.title}>{movie.title}</h3>
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
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <img src="/images/no-results.png" alt="No Results Found" className="w-48 h-auto mb-6 drop-shadow-2xl" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No results found</h2>
          <p className="text-foreground/60 max-w-md">
            We couldn't find any movies matching "{query}". Try checking your spelling or use the Request page to ask us to add it!
          </p>
          <Link href="/request" className="mt-6 px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Request Movie
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-primary font-bold">Loading results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
