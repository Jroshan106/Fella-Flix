// Provider ad policies are self-reported, not guarantees. See docs/streaming-providers.md.
export const STREAMING_SERVERS = [
  { id: "yapgrid", name: "YapGrid", url: (id: string) => `https://yapgrid.com/embed/movie/${id}?autoplay=0&lang=en` },
  { id: "nexus", name: "Movies Nexus", url: (id: string) => `https://www.moviesnexus.fun/movie/${id}?autoPlay=0` },
  { id: "nexus-multi", name: "Nexus Multi-audio", url: (id: string) => `https://www.moviesnexus.fun/movie/${id}?sv=multi-audio&autoPlay=0` },
  { id: "vidcore", name: "VidCore(ads)", url: (id: string) => `https://vidcore.org/embed/movie/${id}?theme=8fba96&autoplay=false` },
  { id: "vidlink", name: "VidLink(ads)", url: (id: string) => `https://vidlink.pro/movie/${id}?primaryColor=8fba96&secondaryColor=394d3e&autoplay=false` },
] as const;

export type StreamingServer = typeof STREAMING_SERVERS[number];
// TV embeds use TMDB TV IDs followed by the selected season and episode.
const SERIES_URLS: Record<StreamingServer["id"], (id: string, season: number, episode: number) => string> = {
  yapgrid: (id, season, episode) => `https://yapgrid.com/embed/tv/${id}/${season}/${episode}?autoplay=0&lang=en`,
  nexus: (id, season, episode) => `https://www.moviesnexus.fun/tv/${id}/${season}/${episode}?autoPlay=0&autoNext=0`,
  "nexus-multi": (id, season, episode) => `https://www.moviesnexus.fun/tv/${id}/${season}/${episode}?sv=multi-audio&autoPlay=0&autoNext=0`,
  vidcore: (id, season, episode) => `https://vidcore.org/embed/tv/${id}/${season}/${episode}?theme=8fba96&autoplay=false`,
  vidlink: (id, season, episode) => `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=8fba96&secondaryColor=394d3e&autoplay=false`,
};
export const PLAYER_SANDBOX = "allow-scripts allow-same-origin allow-presentation";
export const SERVER_STORAGE_KEY = "fellaflix_streaming_provider_v2";

export function getStreamingServer(id: string | null): StreamingServer {
  return STREAMING_SERVERS.find(server => server.id === id) ?? STREAMING_SERVERS[0];
}

export function getMovieEmbedUrl(server: StreamingServer, movieId: string): string | null {
  return /^[1-9]\d{0,9}$/.test(movieId) ? server.url(movieId) : null;
}

export function getSeriesEmbedUrl(server: StreamingServer, id: string, season: number, episode: number): string | null {
  if (!/^[1-9]\d{0,9}$/.test(id) || !Number.isInteger(season) || season < 0 || season > 9999 ||
      !Number.isInteger(episode) || episode < 1 || episode > 9999) return null;
  return SERIES_URLS[server.id](id, season, episode);
}
