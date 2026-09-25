import React, { useState, useRef, useEffect } from 'react';

export function GenreDropdown({ allGenres, selectedGenres, onChange }: { allGenres: string[], selectedGenres: string[], onChange: (g: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter(g => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="relative inline-flex z-20 w-full md:w-48" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        type="button" 
        className="w-full py-2.5 px-4 inline-flex justify-between items-center gap-x-2 text-sm font-medium rounded-xl bg-card border border-primary/30 text-foreground shadow-sm hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
        aria-haspopup="menu" 
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedGenres.length === 0 ? "All Genres" : `${selectedGenres.length} Selected`}</span>
        <svg className={`${isOpen ? 'rotate-180' : ''} transition-transform w-2.5 h-2.5`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-card border border-primary/20 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto" role="menu">
          <div className="p-1 space-y-0.5">
            {allGenres.map(genre => (
              <label key={genre} className="flex items-center gap-x-3 py-2 px-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleToggle(genre)}
                  className="shrink-0 w-4 h-4 bg-transparent border-primary/40 rounded-sm shadow-sm text-primary focus:ring-primary checked:bg-primary checked:border-primary disabled:opacity-50" 
                />
                <span className="block text-sm text-foreground select-none">{genre}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
