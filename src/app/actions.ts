"use server";

import fs from 'fs';
import path from 'path';
import { Movie } from './data/movies';

export async function addMovie(formData: FormData) {
  const newMovie: Movie = {
    id: Number(formData.get("id")),
    title: formData.get("title") as string,
    poster_path: formData.get("poster_path") as string,
    backdrop_path: formData.get("backdrop_path") as string || "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg", // Default backdrop
    overview: formData.get("overview") as string || "No overview available.",
    release_date: formData.get("release_date") as string || new Date().toISOString().split('T')[0],
    vote_average: Number(formData.get("vote_average")) || 0,
    type: formData.get("type") as "movie" | "anime"
  };

  const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'movies.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const movies: Movie[] = JSON.parse(fileContents);
    
    // Check if ID already exists
    if (!movies.some(m => m.id === newMovie.id)) {
      movies.push(newMovie);
      fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
      return { success: true, message: `Successfully added ${newMovie.title}!` };
    } else {
      return { success: false, message: "Movie with this ID already exists." };
    }
  } catch (error) {
    console.error("Failed to add movie:", error);
    return { success: false, message: "Server error while saving movie." };
  }
}
