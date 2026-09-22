"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Film } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
            <span className="font-bold text-2xl tracking-tighter text-primary">FellaFLIX</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
            <Link href="/request" className="text-foreground hover:text-primary transition-colors font-medium">Request a Movie</Link>
            
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
      </div>
    </motion.nav>
  );
}
