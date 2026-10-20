"use client";

import { useState } from "react";
import type { Movie, SeasonDetails } from "../data/movies";
import type { StreamingServer } from "../data/streaming";
import FellaPlayer from "./FellaPlayer";
import { useCatalog } from "./useCatalog";
import { CatalogStatus } from "./CatalogStatus";

export default function SeriesPlayer({ movie, server, onNext }: {
  movie: Movie; server: StreamingServer; onNext: () => void;
}) {
  const seasons = movie.seasons ?? [];
  const [seasonNumber, setSeasonNumber] = useState(() => seasons.find(season => season.season_number > 0)?.season_number ?? seasons[0]?.season_number ?? 1);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  if (!seasons.length) return <p className="p-8 text-center">No episodes are available for this series yet.</p>;
  return <>
    <label className="block mb-4 font-semibold">Season
      <select aria-label="Season" value={seasonNumber} onChange={event => { setSeasonNumber(Number(event.target.value)); setEpisodeNumber(1); }}
        className="ml-3 rounded-lg border border-primary/30 bg-card p-3 text-foreground">
        {seasons.map(season => <option key={season.season_number} value={season.season_number}>{season.name}</option>)}
      </select>
    </label>
    <SeasonPlayer key={`${movie.id}-${seasonNumber}`} id={String(movie.id)} title={movie.title} season={seasonNumber}
      episodeNumber={episodeNumber} setEpisodeNumber={setEpisodeNumber} server={server} onNext={onNext} />
  </>;
}

function SeasonPlayer({ id, title, season, episodeNumber, setEpisodeNumber, server, onNext }: {
  id: string; title: string; season: number; episodeNumber: number; setEpisodeNumber: (number: number) => void;
  server: StreamingServer; onNext: () => void;
}) {
  const { data, error, loading, retry } = useCatalog<{ season: SeasonDetails }>(`/api/catalog?kind=series&id=${id}&season=${season}`);
  if (loading || error) return <CatalogStatus error={error} retry={retry} />;
  const episodes = data?.season.episodes ?? [];
  const episode = episodes.find(item => item.episode_number === episodeNumber) ?? episodes[0];
  if (!episode) return <p className="p-8 text-center">No episodes are available in this season yet.</p>;
  const next = episodes[episodes.indexOf(episode) + 1];
  return <>
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <label className="font-semibold">Episode
        <select aria-label="Episode" value={episode.episode_number} onChange={event => setEpisodeNumber(Number(event.target.value))}
          className="ml-3 max-w-full rounded-lg border border-primary/30 bg-card p-3 text-foreground">
          {episodes.map(item => <option key={item.episode_number} value={item.episode_number}>{item.episode_number}. {item.name}</option>)}
        </select>
      </label>
      {next && <button className="rounded-lg bg-primary px-4 py-3 text-background font-semibold" onClick={() => setEpisodeNumber(next.episode_number)}>Next episode →</button>}
    </div>
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-primary/20 max-h-[80vh]">
      <FellaPlayer key={`${id}-${season}-${episode.episode_number}-${server.id}`} id={id} title={`${title} — S${season} E${episode.episode_number}`}
        season={season} episode={episode.episode_number} server={server} onNext={onNext} />
    </div>
  </>;
}
