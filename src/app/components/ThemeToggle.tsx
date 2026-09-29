import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10 shrink-0 rounded-full bg-card animate-pulse" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-card border border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
        <Moon className="w-5 h-5 text-primary" />
      </div>
      <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
        <Sun className="w-5 h-5 text-[#ffa500]" />
      </div>
    </button>
  );
}
