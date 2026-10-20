export interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  has_rating?: boolean;
  type: "movie" | "series";
  genres?: string[];
  seasons?: Season[];
}

export interface Season { season_number: number; name: string; episode_count: number }
export interface Episode { episode_number: number; name: string; air_date: string | null }
export interface SeasonDetails { season_number: number; episodes: Episode[] }

export interface Genre { id: number; name: string }
export interface CatalogPage {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
  genres: Genre[];
}
