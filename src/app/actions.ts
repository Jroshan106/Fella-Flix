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
  
  if (!validPassword || user !== 'admin' || pwd !== validPassword) {
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

  try {
    const movies = getMoviesData();
    const index = movies.findIndex(m => m.id === updatedMovie.id);
    
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
