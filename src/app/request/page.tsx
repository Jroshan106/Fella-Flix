"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";

export default function RequestMovie() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your request has been submitted to the admin team!");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-primary/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Request a Movie</h1>
          <p className="text-card-foreground/70 text-sm">
            Can't find what you're looking for? Let us know and we'll add it to the library!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="movieName" className="block text-sm font-medium text-card-foreground mb-2">
              Movie or Anime Title
            </label>
            <input
              type="text"
              id="movieName"
              className="block w-full px-4 py-3 border border-primary/30 rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. Inception (2010)"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              id="message"
              rows={3}
              className="block w-full px-4 py-3 border border-primary/30 rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Any specific version or language?"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group"
          >
            Submit Request
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
