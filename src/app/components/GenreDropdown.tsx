"use client";

import { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function GenreDropdown({ allGenres, selectedGenres, onChange }: {
  allGenres: string[]; selectedGenres: string[]; onChange: (genres: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const toggle = (genre: string) => onChange(selectedGenres.includes(genre)
    ? selectedGenres.filter(value => value !== genre) : [...selectedGenres, genre]);

  return <div ref={dropdownRef} className="relative inline-flex z-20 w-full md:w-48"
    onKeyDown={event => {
      if (event.key === "Escape" && isOpen) { event.preventDefault(); setIsOpen(false); buttonRef.current?.focus(); }
      if (event.key === "ArrowDown" && event.target === buttonRef.current) {
        event.preventDefault();
        if (!isOpen) setIsOpen(true);
        else dropdownRef.current?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.focus();
      }
    }}
    onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setIsOpen(false); }}>
    <button ref={buttonRef} type="button" onClick={() => setIsOpen(value => !value)} aria-expanded={isOpen} aria-controls={panelId}
      className="w-full min-h-11 py-2.5 px-4 inline-flex justify-between items-center gap-2 text-sm font-medium rounded-xl bg-card border border-primary/30 text-foreground shadow-sm hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className="truncate">{selectedGenres.length ? `${selectedGenres.length} Selected` : "All Genres"}</span>
      <motion.svg aria-hidden="true" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}
        className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    </button>
    <AnimatePresence>
      {isOpen && <motion.div key="genres" id={panelId} role="group" aria-label="Genres"
        initial={{ opacity: 0, y: reducedMotion ? 0 : -8, scale: reducedMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -6, scale: reducedMotion ? 1 : 0.98 }}
        transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
        className="absolute top-full left-0 mt-2 w-full origin-top bg-card border border-primary/20 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto p-1">
        {allGenres.map(genre => <label key={genre} className="flex min-h-11 items-center gap-3 px-3 rounded-lg hover:bg-primary/10 focus-within:bg-primary/10 cursor-pointer">
          <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggle(genre)} className="h-4 w-4 shrink-0 accent-primary" />
          <span className="text-sm select-none">{genre}</span>
        </label>)}
      </motion.div>}
    </AnimatePresence>
  </div>;
}
