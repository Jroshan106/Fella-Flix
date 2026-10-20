"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Maximize, RefreshCw, SkipForward } from "lucide-react";
import { getMovieEmbedUrl, getSeriesEmbedUrl, PLAYER_SANDBOX, type StreamingServer } from "@/app/data/streaming";

export default function FellaPlayer({ id, title, server, onNext, season, episode }: {
  id: string; title: string; server: StreamingServer; onNext: () => void;
  season?: number; episode?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const url = season !== undefined ? getSeriesEmbedUrl(server, id, season, episode ?? 0) : getMovieEmbedUrl(server, id);

  useEffect(() => {
    if (loaded || !url) return;
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [attempt, loaded, url]);

  const reload = () => {
    setLoaded(false);
    setSlow(false);
    setAttempt(value => value + 1);
  };

  return (
    <div ref={container} className="absolute inset-0 flex flex-col bg-black text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-950 border-b border-white/10">
        <div className="min-w-0">
          <span className="text-sm font-black tracking-wider text-[#8fba96]">FellaFLIX Player</span>
          <span className="ml-3 text-xs text-white/60">{server.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={reload} aria-label="Reload player" title="Reload player" className="p-2 rounded hover:bg-white/10"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={onNext} className="flex items-center gap-1 p-2 rounded text-xs hover:bg-white/10"><SkipForward className="h-4 w-4" />Next server</button>
          <button aria-label="Fullscreen" title="Fullscreen" className="p-2 rounded hover:bg-white/10" onClick={async () => {
            try {
              if (document.fullscreenElement) await document.exitFullscreen();
              else await container.current?.requestFullscreen();
              setFullscreenError(false);
            } catch { setFullscreenError(true); }
          }}><Maximize className="h-4 w-4" /></button>
        </div>
      </div>
      {fullscreenError && <p role="status" className="px-3 py-1 text-xs">Use the fullscreen control inside the video on this browser.</p>}
      <div className="relative flex-1 min-h-0">
        {url ? <iframe key={`${url}-${attempt}`} src={url} className="absolute inset-0 w-full h-full border-0"
          sandbox={PLAYER_SANDBOX} referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen
          title={`${title} — ${server.name} player`}
          onLoad={() => { setLoaded(true); setSlow(false); }} /> :
          <p role="alert" className="p-6 text-center">This title or episode is invalid. Return to browsing and select a title.</p>}
        {url && !loaded && <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-lg bg-zinc-900/95 px-4 py-3 text-center text-sm pointer-events-none" role="status">
          <LoaderCircle className="inline mr-2 h-4 w-4 animate-spin text-[#8fba96]" />
          {slow ? "Taking longer than expected. Try Next server above." : `Opening ${server.name}…`}
        </div>}
      </div>
    </div>
  );
}
