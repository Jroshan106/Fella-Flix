"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Plus, Edit, Trash2, Search, X } from "lucide-react";
import { addMovie, updateMovie, deleteMovie } from "../actions";
import { mockMovies, Movie } from "../data/movies";

export default function AdminPage() {
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit mode state
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = editingMovie 
        ? await updateMovie(formData)
        : await addMovie(formData);
        
      setStatus({ type: result.success ? 'success' : 'error', msg: result.message });
      if (result.success) {
        if (!editingMovie) (e.target as HTMLFormElement).reset();
        // Since mockMovies is statically imported, we can't refresh it without page reload in this client component easily. 
        // A simple window.location.reload() keeps the UI in sync instantly for admin.
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Failed to submit form." });
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    const result = await deleteMovie(id);
    if (result.success) {
      alert("Movie deleted!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const filteredMovies = mockMovies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.id.toString().includes(searchQuery)
  );

  return (
    <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full py-12 px-4 gap-8">
      {/* Left: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-card p-8 rounded-2xl shadow-xl border border-red-900/30 relative overflow-hidden self-start"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ShieldAlert className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Admin Control Panel</h1>
              <p className="text-card-foreground/70 text-sm">
                {editingMovie ? `Editing: ${editingMovie.title}` : "Add a new movie to the library"}
              </p>
            </div>
          </div>
          {editingMovie && (
            <button 
              onClick={() => setEditingMovie(null)}
              className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full flex items-center hover:bg-primary/30 transition-colors"
            >
              <X className="w-4 h-4 mr-1" /> Cancel Edit
            </button>
          )}
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" key={editingMovie ? editingMovie.id : 'new'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Title *</label>
              <input name="title" defaultValue={editingMovie?.title} required type="text" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="e.g. Inception" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">TMDB ID *</label>
              <input name="id" defaultValue={editingMovie?.id} readOnly={!!editingMovie} required type="number" className={`w-full px-3 py-2 border border-primary/30 rounded-lg text-foreground ${editingMovie ? 'bg-foreground/10 cursor-not-allowed' : 'bg-background'}`} placeholder="e.g. 27205" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Poster URL (w500 size recommended) *</label>
              <input name="poster_path" defaultValue={editingMovie?.poster_path} required type="url" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="https://image.tmdb.org/t/p/w500/..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Backdrop URL (Optional)</label>
              <input name="backdrop_path" defaultValue={editingMovie?.backdrop_path} type="url" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="https://image.tmdb.org/t/p/original/..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-1">Overview (Optional)</label>
              <textarea name="overview" defaultValue={editingMovie?.overview} rows={3} className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="Movie description..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Release Date (Optional)</label>
              <input name="release_date" defaultValue={editingMovie?.release_date} type="date" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Vote (0-10)</label>
                <input name="vote_average" defaultValue={editingMovie?.vote_average} type="number" step="0.1" min="0" max="10" className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground" placeholder="8.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Type *</label>
                <select name="type" defaultValue={editingMovie?.type || "movie"} required className="w-full px-3 py-2 border border-primary/30 rounded-lg bg-background text-foreground">
                  <option value="movie">Movie</option>
                  <option value="anime">Anime</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white focus:outline-none transition-all disabled:opacity-50 ${editingMovie ? 'bg-primary hover:bg-primary/90' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {editingMovie ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {isSubmitting ? "Saving..." : editingMovie ? "Update Movie" : "Add Movie to Library"}
          </button>
        </form>
      </motion.div>

      {/* Right: Library List */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-card rounded-2xl shadow-xl border border-primary/20 flex flex-col max-h-[850px]"
      >
        <div className="p-6 border-b border-primary/20">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Manage Library ({mockMovies.length})</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search by title or TMDB ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-primary/30 rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow space-y-2">
          {filteredMovies.map(m => (
            <div key={m.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${editingMovie?.id === m.id ? 'bg-primary/10 border-primary' : 'bg-background border-primary/10 hover:border-primary/30'}`}>
              <div className="flex items-center space-x-3 overflow-hidden">
                <img src={m.poster_path} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />
                <div className="truncate">
                  <p className="font-semibold text-sm text-foreground truncate">{m.title}</p>
                  <p className="text-xs text-foreground/50">ID: {m.id} • {m.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={() => setEditingMovie(m)}
                  className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(m.id, m.title)}
                  className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredMovies.length === 0 && (
            <p className="text-center text-sm text-foreground/50 py-10">No movies found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
