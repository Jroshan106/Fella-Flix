import "server-only";
import type { CatalogPage, Movie } from "@/app/data/movies";
import { CatalogError } from "./tmdb";

interface OMDbMovie {
  imdbID: string;
  Title: string;
  Year?: string;
  Poster?: string;
  Plot?: string;
  Genre?: string;
  Country?: string;
  imdbRating?: string;
  Type?: string;
}
interface OMDbResponse extends Partial<OMDbMovie> {
  Response: string;
  Error?: string;
  Search?: OMDbMovie[];
  totalResults?: string;
}

// OMDb has no discovery endpoint. Only IDs are curated; metadata comes from OMDb.
const featured = ["tt0111161", "tt0068646", "tt0468569", "tt1375666", "tt0133093", "tt0816692", "tt0109830", "tt0120737", "tt0110912", "tt0088763"];
const anime = ["tt0245429", "tt0119698", "tt0347149", "tt0096283", "tt5311514", "tt0094625", "tt0876563", "tt1798188", "tt0347618", "tt0119691"];
const clean = (value?: string) => value && value !== "N/A" ? value : "";

async function omdb(params: Record<string, string>): Promise<OMDbResponse> {
  const key = process.env.OMDB_API_KEY?.trim();
  if (!key) throw new CatalogError("The movie catalog is not configured yet. Please try again later.", 503);
  const url = new URL("https://www.omdbapi.com/");
  url.search = new URLSearchParams({ ...params, apikey: key, r: "json", type: "movie" }).toString();
  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) });
  } catch { throw new CatalogError("The movie catalog could not be reached. Please retry."); }
  if (response.status === 401 || response.status === 403) throw new CatalogError("The movie catalog is temporarily unavailable.", 503);
  if (response.status === 429) throw new CatalogError("The movie catalog is busy. Please try again shortly.", 429);
  if (!response.ok) throw new CatalogError("The movie catalog could not be loaded. Please retry.");
  let data: OMDbResponse;
  try { data = await response.json(); }
  catch { throw new CatalogError("The movie catalog returned an invalid response."); }
  if (!data || !["True", "False"].includes(data.Response)) throw new CatalogError("The movie catalog returned an invalid response.");
  if (data.Response === "False") {
    if (/not found|no movies/i.test(data.Error || "")) return data;
    if (/too many results/i.test(data.Error || "")) throw new CatalogError("Please enter a more specific movie title.", 400);
    if (/limit/i.test(data.Error || "")) throw new CatalogError("The movie catalog has reached its daily limit. Please try again later.", 429);
    throw new CatalogError("The movie catalog is temporarily unavailable.", 503);
  }
  return data;
}

function normalize(movie: OMDbMovie, isAnime = false): Movie {
  if (!/^tt\d{7,10}$/.test(movie.imdbID) || !movie.Title) throw new CatalogError("The movie catalog returned an invalid response.");
  const genres = clean(movie.Genre).split(", ").filter(Boolean);
  const rating = Number.parseFloat(movie.imdbRating || "");
  const poster = clean(movie.Poster);
  return {
    id: movie.imdbID, title: movie.Title,
    poster_path: /^https:\/\/(?:m\.media-amazon\.com|ia\.media-imdb\.com)\//.test(poster) ? poster : "/images/no-results.png",
    backdrop_path: "", overview: clean(movie.Plot) || "Open this movie to see its full description.",
    release_date: clean(movie.Year).match(/^\d{4}/)?.[0] || "",
    vote_average: Number.isFinite(rating) ? rating : 0, has_rating: Number.isFinite(rating),
    genres, type: isAnime || (genres.includes("Animation") && !!movie.Country?.split(", ").includes("Japan")) ? "anime" : "movie",
  };
}

export async function getOMDbMovie(id: string): Promise<Movie> {
  if (!/^tt\d{7,10}$/.test(id)) throw new CatalogError("Invalid IMDb movie ID.", 400);
  const data = await omdb({ i: id, plot: "full" });
  if (data.Response === "False" || data.Type !== "movie") throw new CatalogError("Movie not found.", 404);
  return normalize(data as OMDbMovie);
}

export async function getOMDbCatalog(params: URLSearchParams): Promise<CatalogPage> {
  const page = params.get("page") || "1";
  const kind = params.get("kind") || "movie";
  const query = (params.get("q") || "").trim();
  if (!/^\d+$/.test(page) || +page < 1 || +page > 100 || !["movie", "anime"].includes(kind) || query.length > 200 || params.get("genres") || (query && kind === "anime")) {
    throw new CatalogError("Invalid catalog filters.", 400);
  }
  if (query) {
    const data = await omdb({ s: query, page });
    if (data.Response === "False") return { results: [], page: +page, total_pages: 0, total_results: 0, genres: [] };
    if (!Array.isArray(data.Search) || !/^\d+$/.test(data.totalResults || "")) throw new CatalogError("The movie catalog returned an invalid response.");
    const total = Number(data.totalResults);
    return { results: data.Search.filter(movie => movie.Type === "movie").map(movie => normalize(movie)), page: +page, total_pages: Math.min(100, Math.ceil(total / 10)), total_results: total, genres: [] };
  }
  if (+page !== 1) throw new CatalogError("Featured selections have only one page. Search for more movies.", 400);
  const ids = kind === "anime" ? anime : featured;
  const results = await Promise.all(ids.map(async id => {
    try { return { ...await getOMDbMovie(id), type: kind as Movie["type"] }; }
    catch (error) { if (error instanceof CatalogError && error.status === 404) return null; throw error; }
  }));
  const movies = results.filter((movie): movie is Movie => movie !== null);
  return { results: movies, page: 1, total_pages: movies.length ? 1 : 0, total_results: movies.length, genres: [] };
}
