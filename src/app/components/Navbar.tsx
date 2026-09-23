"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, Home, FolderOpen, MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* DESKTOP NAVBAR (Hidden on mobile) */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden sm:block fixed w-full z-50 top-0 border-b border-primary/20 bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              {mounted ? (
                <img 
                  src={theme === 'dark' ? '/images/dark_logo.png' : '/images/light_logo.png'} 
                  alt="FellaFLIX" 
                  className="h-10 w-auto transform group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-10 w-32 bg-foreground/10 animate-pulse rounded-md"></div>
              )}
            </Link>
            
            <div className="flex items-center space-x-6 flex-grow justify-end max-w-lg ml-4">
              {pathname === '/' && (
                <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="block w-full pl-9 pr-3 py-1.5 border border-primary/30 rounded-full bg-card text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                  />
                </form>
              )}

              <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary font-bold' : 'text-foreground hover:text-primary'}`}>Home</Link>
              <Link href="/all" className={`text-sm font-medium transition-colors ${pathname === '/all' ? 'text-primary font-bold' : 'text-foreground hover:text-primary'}`}>Library</Link>
              <Link href="/request" className={`text-sm font-medium whitespace-nowrap transition-colors ${pathname === '/request' ? 'text-primary font-bold' : 'text-foreground hover:text-primary'}`}>Request</Link>
              
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-card transition-colors bg-card/50 shadow-sm border border-primary/10"
                aria-label="Toggle theme"
              >
                {mounted && (
                  theme === "dark" ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE TOP HEADER (Logo + Search) */}
      <div className="sm:hidden fixed top-0 w-full z-40 bg-background/90 backdrop-blur-lg border-b border-primary/20 pb-3 pt-4 px-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <Link href="/" className="flex items-center space-x-2">
            {mounted ? (
              <img 
                src={theme === 'dark' ? '/images/dark_logo.png' : '/images/light_logo.png'} 
                alt="FellaFLIX" 
                className="h-8 w-auto"
              />
            ) : (
              <div className="h-8 w-24 bg-foreground/10 animate-pulse rounded-md"></div>
            )}
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-card shadow-sm border border-primary/20 text-primary"
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          </button>
        </div>
        {pathname === '/' && (
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="block w-full pl-10 pr-3 py-2.5 border border-primary/30 rounded-xl bg-card text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
            />
          </form>
        )}
      </div>

      {/* MOBILE FLOATING BOTTOM APP-NAV */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="sm:hidden fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 flex justify-around items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/20">
          <Link href="/" className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${pathname === '/' ? 'bg-primary/20 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-primary/5'}`}>
            <Home className={`w-5 h-5 mb-1 ${pathname === '/' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          
          <Link href="/all" className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${pathname === '/all' ? 'bg-primary/20 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-primary/5'}`}>
            <FolderOpen className={`w-5 h-5 mb-1 ${pathname === '/all' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-medium">Library</span>
          </Link>

          <Link href="/request" className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${pathname === '/request' ? 'bg-primary/20 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-primary/5'}`}>
            <MessageSquarePlus className={`w-5 h-5 mb-1 ${pathname === '/request' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-medium">Request</span>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
