import "server-only";
import * as tmdb from "./tmdb";
import { getOMDbCatalog, getOMDbMovie } from "./omdb";

export { CatalogError } from "./tmdb";
export const getCatalogProvider = () => process.env.OMDB_API_KEY?.trim() ? "omdb" : "tmdb";
export const getGenres = () => getCatalogProvider() === "omdb" ? Promise.resolve([]) : tmdb.getGenres();
export const getCatalog = (params: URLSearchParams) => getCatalogProvider() === "omdb" ? getOMDbCatalog(params) : tmdb.getCatalog(params);
// Preserve the namespace of bookmarked IDs instead of treating IMDb IDs as TMDB IDs.
export const getMovie = (id: string) => id.startsWith("tt") ? getOMDbMovie(id) : tmdb.getMovie(id);
