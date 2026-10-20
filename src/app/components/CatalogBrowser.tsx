"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CatalogPage } from "@/app/data/movies";
import { useCatalog } from "./useCatalog";
import { CatalogStatus } from "./CatalogStatus";
import { GenreDropdown } from "./GenreDropdown";
import { Pagination } from "./Pagination";

export default function CatalogBrowser({ kind = "movie", initialQuery = "" }: {
  kind?: "movie" | "anime"; initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const genres = useCatalog<{ genres: { id: number; name: string }[]; provider: string }>("/api/catalog?view=genres");
  const genreList = genres.data?.genres ?? [];
  const genreIds = genreList.filter(genre => selectedGenres.includes(genre.name)).map(genre => genre.id);
  const params = new URLSearchParams({ kind, page: String(page) });
  if (query.trim()) params.set("q", query.trim());
  else if (genreIds.length) params.set("genres", genreIds.join(","));
  const { data, error, loading, retry } = useCatalog<CatalogPage>(`/api/catalog?${params}`);

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-4xl font-black">{kind === "anime" ? "Anime Movies" : initialQuery ? "Search Results" : "Movies"}</h1>
        <p className="mt-2 text-foreground/70">{kind === "anime" ? "Japanese animated films from TMDB" : "Discover and search movies on TMDB"}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!query.trim() && genreList.length > 0 && <GenreDropdown allGenres={genreList.map(genre => genre.name)}
          selectedGenres={selectedGenres} onChange={value => { setSelectedGenres(value); setPage(1); }} />}
        {kind === "movie" ? <input aria-label="Search movies" placeholder="Search movies…"
          value={query} maxLength={200} onChange={event => { setQuery(event.target.value); setSelectedGenres([]); setPage(1); }}
          className="rounded-xl border border-primary/30 bg-card px-4 py-3 text-foreground" /> :
          <Link href="/search" className="text-primary underline">Search all movies</Link>}
      </div>
    </div>
    {loading || error ? <CatalogStatus error={error} retry={retry} /> : <>
      <p className="mb-5 text-sm text-foreground/60">{data?.total_results.toLocaleString()} results</p>
      {data?.results.length ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {data.results.map(movie => <Link key={movie.id} href={`/watch/${movie.id}`}
          className="group rounded-xl overflow-hidden bg-card shadow-md hover:-translate-y-1 transition-transform">
          <div className="aspect-[2/3] relative bg-black">
            <Image src={movie.poster_path} alt={movie.title} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover" />
          </div>
          <div className="p-3">
            <h2 className="font-bold truncate" title={movie.title}>{movie.title}</h2>
            <div className="flex justify-between mt-2 text-xs text-foreground/70">
              <span>{movie.release_date.slice(0, 4) || "Date TBA"}</span><span>{movie.has_rating === false ? "Unrated" : `★ ${movie.vote_average.toFixed(1)}`}</span>
            </div>
          </div>
        </Link>)}
      </div> : <p className="py-16 text-center text-foreground/60">No movies found. Try another search or genre.</p>}
      <Pagination currentPage={page} totalPages={data?.total_pages ?? 0} onPageChange={setPage} />
    </>}
  </div>;
}
