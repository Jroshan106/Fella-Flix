import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-[60px] h-[30px] rounded-full bg-card animate-pulse" />;

  const isDark = theme === "dark";

  return (
    <div className="relative inline-block w-[60px] h-[30px] rounded-[30px] bg-card border-2 border-primary overflow-hidden shadow-inner cursor-pointer" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {/* Sun/Moon Icons inside track */}
      <div className="absolute w-full h-full flex justify-between items-center px-1.5 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-60">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-60">
          <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </div>
      
      {/* Thumb / Knob */}
      <div className={`absolute top-0.5 left-0.5 w-[22px] h-[22px] bg-primary rounded-full z-10 transition-transform duration-300 ease-in-out ${isDark ? 'translate-x-[29px]' : 'translate-x-0'} shadow-md flex items-center justify-center`}>
         {/* Little crater/ray details depending on theme */}
         {isDark ? (
           <div className="w-1.5 h-1.5 bg-background rounded-full opacity-60 transform -translate-x-0.5 -translate-y-0.5" />
         ) : (
           <div className="w-1.5 h-1.5 bg-background rounded-full opacity-60" />
         )}
      </div>
    </div>
  );
}
