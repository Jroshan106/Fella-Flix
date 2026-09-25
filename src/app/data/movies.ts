import movies from './movies.json';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  type: "movie" | "anime";
  genres?: string[];
}

export const mockMovies = movies as Movie[];
