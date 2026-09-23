"use server";

import fs from 'fs';
import path from 'path';
import { Movie } from './data/movies';
import { headers } from 'next/headers';

const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'movies.json');

function getMoviesData(): Movie[] {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function verifyAuth() {
  const headersList = await headers();
  const basicAuth = headersList.get('authorization');
  if (!basicAuth) throw new Error("Unauthorized");
  
  const authValue = basicAuth.split(' ')[1];
  const [user, pwd] = atob(authValue).split(':');
  const validPassword = process.env.ADMIN_PASSWORD;
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  
  if (!validPassword || user !== validUser || pwd !== validPassword) {
    throw new Error("Unauthorized");
  }
}

export async function addMovie(formData: FormData) {
  try {
    await verifyAuth();
  } catch {
    return { success: false, message: "Unauthorized access." };
  }

  const newMovie: Movie = {
    id: Number(formData.get("id")),
    title: formData.get("title") as string,
    poster_path: formData.get("poster_path") as string,
    backdrop_path: formData.get("backdrop_path") as string || "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    overview: formData.get("overview") as string || "No overview available.",
    release_date: formData.get("release_date") as string || new Date().toISOString().split('T')[0],
    vote_average: Number(formData.get("vote_average")) || 0,
    type: formData.get("type") as "movie" | "anime"
  };

  try {
    const movies = getMoviesData();
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

export async function updateMovie(formData: FormData) {
  try {
    await verifyAuth();
  } catch {
    return { success: false, message: "Unauthorized access." };
  }

  const updatedMovie: Movie = {
    id: Number(formData.get("id")),
    title: formData.get("title") as string,
    poster_path: formData.get("poster_path") as string,
    backdrop_path: formData.get("backdrop_path") as string,
    overview: formData.get("overview") as string,
    release_date: formData.get("release_date") as string,
    vote_average: Number(formData.get("vote_average")),
    type: formData.get("type") as "movie" | "anime"
  };

  const originalId = formData.get("original_id") ? Number(formData.get("original_id")) : updatedMovie.id;

  try {
    const movies = getMoviesData();
    const index = movies.findIndex(m => m.id === originalId);
    
    if (index !== -1) {
      movies[index] = updatedMovie;
      fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
      return { success: true, message: `Successfully updated ${updatedMovie.title}!` };
    } else {
      return { success: false, message: "Movie not found." };
    }
  } catch (error) {
    return { success: false, message: "Server error while updating movie." };
  }
}

export async function deleteMovie(id: number) {
  try {
    await verifyAuth();
  } catch {
    return { success: false, message: "Unauthorized access." };
  }

  try {
    const movies = getMoviesData();
    const newMovies = movies.filter(m => m.id !== id);
    if (movies.length !== newMovies.length) {
      fs.writeFileSync(filePath, JSON.stringify(newMovies, null, 2));
      return { success: true, message: `Successfully deleted movie!` };
    } else {
      return { success: false, message: "Movie not found." };
    }
  } catch (error) {
    return { success: false, message: "Server error while deleting movie." };
  }
}

// REQUEST SYSTEM

const requestsPath = path.join(process.cwd(), 'src', 'app', 'data', 'requests.json');

export interface MovieRequest {
  id: string;
  title: string;
  details: string;
  date: string;
}

export async function submitRequest(formData: FormData) {
  const newReq: MovieRequest = {
    id: Date.now().toString(),
    title: formData.get("title") as string,
    details: formData.get("details") as string || "",
    date: new Date().toISOString().split('T')[0]
  };

  try {
    let requests: MovieRequest[] = [];
    if (fs.existsSync(requestsPath)) {
      requests = JSON.parse(fs.readFileSync(requestsPath, 'utf8'));
    }
    requests.push(newReq);
    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function fetchMovieFromTMDB(tmdbId: string) {
  try {
    await verifyAuth();
  } catch {
    return { success: false, message: "Unauthorized access." };
  }

  try {
    const res = await fetch(`https://www.themoviedb.org/movie/${tmdbId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    
    if (res.status === 404) {
      return { success: false, message: "Movie not found on TMDB with that ID." };
    }
    
    const html = await res.text();
    
    // Very basic regex extraction for the missing API key
    const titleMatch = html.match(/<title>(.*?)\s\(/) || html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : "";
    
    const overviewMatch = html.match(/<div class="overview" dir="auto">\s*<p>(.*?)<\/p>/);
    const overview = overviewMatch ? overviewMatch[1].trim() : "";
    
    const posterMatch = html.match(/<img class="poster lazyload" data-src="([^"]+)"/);
    let poster_path = posterMatch ? posterMatch[1] : "";
    if (poster_path && !poster_path.startsWith('http')) {
      poster_path = `https://image.tmdb.org${poster_path}`;
    }
    // Convert to w500
    if (poster_path) poster_path = poster_path.replace(/\/w\d+_and_h\d+_bestv2/, '/w500');

    const backdropMatch = html.match(/data-images="([^"]+)"/) || html.match(/background-image: url\('([^']+)'\)/);
    let backdrop_path = backdropMatch ? backdropMatch[1] : "";
    if (backdrop_path && !backdrop_path.startsWith('http')) {
      backdrop_path = `https://image.tmdb.org${backdrop_path}`;
    }
    
    const dateMatch = html.match(/<span class="release">.*?(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})[\s\S]*?/);
    let release_date = "";
    if (dateMatch) {
      release_date = dateMatch[1];
    }

    return { 
      success: true, 
      data: {
        title,
        overview,
        poster_path,
        backdrop_path,
        release_date
      } 
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to scrape TMDB." };
  }
}

export async function getRequests() {
  try {
    await verifyAuth(); // Only admin can read requests
    if (fs.existsSync(requestsPath)) {
      return JSON.parse(fs.readFileSync(requestsPath, 'utf8')) as MovieRequest[];
    }
    return [];
  } catch (err) {
    return [];
  }
}

export async function deleteRequest(id: string) {
  try {
    await verifyAuth();
    let requests: MovieRequest[] = [];
    if (fs.existsSync(requestsPath)) {
      requests = JSON.parse(fs.readFileSync(requestsPath, 'utf8'));
    }
    const newRequests = requests.filter(r => r.id !== id);
    fs.writeFileSync(requestsPath, JSON.stringify(newRequests, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
