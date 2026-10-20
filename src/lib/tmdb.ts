import "server-only";
import type { CatalogPage, Genre, Movie, Season, SeasonDetails } from "@/app/data/movies";

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  first_air_date?: string;
  seasons?: Season[];
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  original_language?: string;
  genre_ids?: number[];
  genres?: Genre[];
  adult?: boolean;
}

export class CatalogError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

// This module is imported only by the catalog route. Credentials never reach the browser.
async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN?.trim();
  const key = process.env.TMDB_API_KEY?.trim();
  if (!token && !key) throw new CatalogError("The movie catalog is not configured yet. Please try again later.", 503);
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.search = new URLSearchParams({ language: "en-US", ...params }).toString();
  if (!token && key) url.searchParams.set("api_key", key);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(10000),
    });
  } catch { throw new CatalogError("The movie catalog could not be reached. Please retry."); }
  if (response.status === 404) throw new CatalogError("Movie not found.", 404);
  if (response.status === 401 || response.status === 403) throw new CatalogError("The movie catalog is temporarily unavailable.", 503);
  if (response.status === 429) throw new CatalogError("The movie catalog is busy. Please try again shortly.", 429);
  if (!response.ok) throw new CatalogError("The movie catalog could not be loaded. Please retry.");
  try { return await response.json() as T; }
  catch { throw new CatalogError("The movie catalog returned an invalid response."); }
}

export function normalizeMovie(movie: TMDBMovie, genres: Genre[] = [], kind: Movie["type"] = "movie"): Movie {
  const ids = movie.genre_ids ?? movie.genres?.map(genre => genre.id) ?? [];
  return {
    id: movie.id, title: movie.title || movie.name || "Untitled",
    poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/images/no-results.png",
    backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "",
    overview: movie.overview || "No overview available.",
    release_date: movie.release_date || movie.first_air_date || "",
    vote_average: Number.isFinite(movie.vote_average) ? movie.vote_average! : 0,
    type: kind,
    ...(kind === "series" ? { seasons: (movie.seasons ?? []).filter(season => season.season_number >= 0 && season.episode_count > 0) } : {}),
    genres: movie.genres?.map(genre => genre.name) ?? genres.filter(genre => ids.includes(genre.id)).map(genre => genre.name),
  };
}

export async function getGenres(kind = "movie"): Promise<Genre[]> {
  if (!["movie", "series"].includes(kind)) throw new CatalogError("Invalid catalog type.", 400);
  const data = await tmdb<{ genres: Genre[] }>(`/genre/${kind === "series" ? "tv" : "movie"}/list`);
  if (!Array.isArray(data.genres)) throw new CatalogError("The movie catalog returned an invalid response.");
  return data.genres;
}

export async function getCatalog(params: URLSearchParams): Promise<CatalogPage> {
  const page = params.get("page") || "1";
  const kind = params.get("kind") || "movie";
  const query = (params.get("q") || "").trim();
  const selected = params.get("genres") || "";
  if (!/^\d+$/.test(page) || Number(page) < 1 || Number(page) > 500 ||
      !["movie", "series"].includes(kind) || query.length > 200 ||
      (selected && !/^\d+(,\d+)*$/.test(selected))) {
    throw new CatalogError("Invalid catalog filters.", 400);
  }
  // TMDB search does not support discover's genre filters. Do not silently filter one page.
  if (query && selected) throw new CatalogError("Search without genre filters.", 400);
  const genres = await getGenres(kind);
  const filters: Record<string, string> = { page, include_adult: "false" };
  if (query) filters.query = query;
  else {
    filters.sort_by = "popularity.desc";
    if (kind === "movie") filters.include_video = "false";
    if (selected) filters.with_genres = selected.replaceAll(",", "|");
  }
  const data = await tmdb<{ results: TMDBMovie[]; page: number; total_pages: number; total_results: number }>(
    `/${query ? "search" : "discover"}/${kind === "series" ? "tv" : "movie"}`, filters,
  );
  if (!Array.isArray(data.results)) throw new CatalogError("The movie catalog returned an invalid response.");
  return {
    results: data.results.filter(movie => !movie.adult).map(movie => normalizeMovie(movie, genres, kind as Movie["type"])),
    page: Number(page), total_pages: Math.min(data.total_pages || 0, 500),
    total_results: data.total_results || 0, genres,
  };
}

export async function getMovie(id: string, kind = "movie"): Promise<Movie> {
  if (!["movie", "series"].includes(kind)) throw new CatalogError("Invalid catalog type.", 400);
  if (!/^[1-9]\d{0,9}$/.test(id)) throw new CatalogError("Invalid movie ID.", 400);
  const data = await tmdb<TMDBMovie>(`/${kind === "series" ? "tv" : "movie"}/${id}`);
  if (!data.id || data.adult) throw new CatalogError("Movie not found.", 404);
  return normalizeMovie(data, [], kind as Movie["type"]);
}

export async function getSeason(id: string, season: string): Promise<SeasonDetails> {
  if (!/^[1-9]\d{0,9}$/.test(id) || !/^(0|[1-9]\d{0,3})$/.test(season)) {
    throw new CatalogError("Invalid series or season.", 400);
  }
  // Check the parent title too, so adult series cannot bypass detail validation.
  await getMovie(id, "series");
  const data = await tmdb<SeasonDetails>(`/tv/${id}/season/${season}`);
  if (!Array.isArray(data.episodes)) throw new CatalogError("The catalog returned an invalid season.");
  return { season_number: Number(season), episodes: data.episodes.filter(episode => Number.isInteger(episode.episode_number) && episode.episode_number > 0) };
}
