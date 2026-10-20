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

export interface Genre { id: number; name: string }
export interface CatalogPage {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
  genres: Genre[];
}
