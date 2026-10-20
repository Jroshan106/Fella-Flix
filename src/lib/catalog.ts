import "server-only";

// TMDB is the only catalog provider, even if an old OMDB_API_KEY is still set.
export { CatalogError, getGenres, getCatalog, getMovie } from "./tmdb";
export const getCatalogProvider = () => "tmdb" as const;
