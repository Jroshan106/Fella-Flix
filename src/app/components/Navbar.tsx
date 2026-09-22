"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Film, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 top-0 border-b border-primary/20 bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-primary" />
            <span className="font-bold text-2xl tracking-tighter text-primary hidden sm:block">FellaFLIX</span>
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-6 flex-grow justify-end max-w-lg ml-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-xs hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-foreground/40" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="block w-full pl-9 pr-3 py-1.5 border border-primary/30 rounded-full bg-card text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </form>

            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium text-sm md:text-base">Home</Link>
            <Link href="/all" className="text-foreground hover:text-primary transition-colors font-medium text-sm md:text-base">Library</Link>
            <Link href="/request" className="text-foreground hover:text-primary transition-colors font-medium text-sm md:text-base whitespace-nowrap">Request</Link>
            
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-card transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === "dark" ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="block w-full pl-9 pr-3 py-2 border border-primary/30 rounded-full bg-card text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </form>
        </div>
      </div>
    </motion.nav>
  );
}
