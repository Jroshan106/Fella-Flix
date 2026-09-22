"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Plus } from "lucide-react";
import { addMovie } from "../actions";

export default function AdminPage() {
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await addMovie(formData);
      setStatus({ type: result.success ? 'success' : 'error', msg: result.message });
      if (result.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Failed to submit form." });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex-grow flex flex-col items-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-card p-8 rounded-2xl shadow-xl border border-red-900/30 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
        
        <div className="flex items-center mb-8">
          <ShieldAlert className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Admin Control Panel</h1>
            <p className="text-card-foreground/70 text-sm">Add new movies or anime directly to the library JSON.</p>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Title *</label>
              <input name="title" required type="text" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="e.g. Inception" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">TMDB ID *</label>
              <input name="id" required type="number" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="e.g. 27205" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Poster URL (w500 size recommended) *</label>
              <input name="poster_path" required type="url" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="https://image.tmdb.org/t/p/w500/..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Backdrop URL (Optional)</label>
              <input name="backdrop_path" type="url" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="https://image.tmdb.org/t/p/original/..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Overview (Optional)</label>
              <textarea name="overview" rows={2} className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="Movie description..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Release Date (Optional)</label>
              <input name="release_date" type="date" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Vote (0-10)</label>
                <input name="vote_average" type="number" step="0.1" min="0" max="10" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="8.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Type *</label>
                <select name="type" required className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground">
                  <option value="movie">Movie</option>
                  <option value="anime">Anime</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isSubmitting ? "Adding to Library..." : "Add Movie to Library"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
