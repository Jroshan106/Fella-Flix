// Provider ad policies are self-reported, not guarantees. See docs/streaming-providers.md.
export const STREAMING_SERVERS = [
  { id: "peestream", name: "PeeStream", url: (id: string) => `https://peestream.in/embed/?tmdbId=${id}&type=movie` },
  { id: "nexus", name: "Movies Nexus", url: (id: string) => `https://www.moviesnexus.fun/movie/${id}?autoPlay=0` },
  { id: "nexus-multi", name: "Nexus Multi-audio", url: (id: string) => `https://www.moviesnexus.fun/movie/${id}?sv=multi-audio&autoPlay=0` },
  { id: "yapgrid", name: "YapGrid", url: (id: string) => `https://yapgrid.com/embed/movie/${id}?autoplay=0&lang=en` },
  { id: "vidcore", name: "VidCore", url: (id: string) => `https://vidcore.org/embed/movie/${id}?theme=8fba96&autoplay=false` },
  { id: "phantom", name: "VidPhantom", url: (id: string) => `https://vidphantom.com/movie/${id}?primaryColor=8fba96&accentColor=8fba96&secondaryColor=394d3e&backdropColor=000000&autoplay=false` },
] as const;

export type StreamingServer = typeof STREAMING_SERVERS[number];
export const PLAYER_SANDBOX = "allow-scripts allow-same-origin allow-presentation";
export const SERVER_STORAGE_KEY = "fellaflix_streaming_provider_v2";

export function getStreamingServer(id: string | null): StreamingServer {
  return STREAMING_SERVERS.find(server => server.id === id) ?? STREAMING_SERVERS[0];
}

export function getMovieEmbedUrl(server: StreamingServer, movieId: string): string | null {
  return /^[1-9]\d{0,9}$/.test(movieId) ? server.url(movieId) : null;
}
