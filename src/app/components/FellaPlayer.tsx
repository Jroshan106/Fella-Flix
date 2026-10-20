"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Maximize, Minimize, RefreshCw, SkipForward } from "lucide-react";
import { getMovieEmbedUrl, getSeriesEmbedUrl, PLAYER_SANDBOX, type StreamingServer } from "@/app/data/streaming";

export default function FellaPlayer({ id, title, server, onNext, season, episode }: {
  id: string; title: string; server: StreamingServer; onNext: () => void;
  season?: number; episode?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const url = season !== undefined ? getSeriesEmbedUrl(server, id, season, episode ?? 0) : getMovieEmbedUrl(server, id);

  useEffect(() => {
    const onFullscreen = () => setExpanded(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    expandButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) setExpanded(false);
      if (event.key === "Tab") {
        const controls = container.current?.querySelectorAll<HTMLElement>("button, iframe");
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); };
  }, [expanded]);

  const toggleExpanded = async () => {
    if (expanded) {
      if (document.fullscreenElement === container.current) await document.exitFullscreen();
      setExpanded(false);
    } else {
      setExpanded(true);
      try { await container.current?.requestFullscreen?.(); } catch { /* The expanded layout also works without browser fullscreen. */ }
    }
  };
  const reload = () => setAttempt(value => value + 1);

  return <div ref={container} role={expanded ? "dialog" : "region"} aria-modal={expanded || undefined} aria-label={`${title} video player`}
    className={expanded ? "fixed inset-0 z-[100] flex flex-col bg-black text-white w-full h-dvh" : "w-full overflow-hidden bg-black text-white sm:rounded-2xl sm:border sm:border-primary/20 shadow-xl"}>
    <div className={`relative w-full ${expanded ? "flex-1 min-h-0" : "aspect-video min-h-[240px] sm:min-h-0"}`}>
      <PlayerVideo key={`${url}-${attempt}`} url={url} title={title} serverName={server.name} />
    </div>
    <div className="flex shrink-0 items-center gap-1 px-2 py-1.5 bg-zinc-950 border-t border-white/10 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="min-w-0 flex-1 px-2"><p className="text-[10px] uppercase tracking-wider text-white/45">FellaFLIX Player</p><p className="truncate text-xs font-semibold text-[#8fba96]">{server.name}</p></div>
      <button onClick={reload} aria-label="Reload player" title="Reload player" className="min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-white/10"><RefreshCw size={18} /></button>
      <button onClick={onNext} className="min-h-11 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold hover:bg-white/10"><SkipForward size={18} />Next server</button>
      <button ref={expandButton} onClick={toggleExpanded} aria-label={expanded ? "Close expanded player" : "Expand player"} title={expanded ? "Close expanded player" : "Expand player"}
        className="min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-white/10">{expanded ? <Minimize size={19} /> : <Maximize size={19} />}</button>
    </div>
  </div>;
}

function PlayerVideo({ url, title, serverName }: { url: string | null; title: string; serverName: string }) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (loaded || !url) return;
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [loaded, url]);
  return <>
      {url ? <iframe src={url} className="absolute inset-0 w-full h-full border-0"
        sandbox={PLAYER_SANDBOX} referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen
        title={`${title} — ${serverName} player`} onLoad={() => { setLoaded(true); setSlow(false); }} /> :
        <p role="alert" className="p-6 text-center">This title or episode is invalid. Return to browsing and select a title.</p>}
      {url && !loaded && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-max max-w-[90%] rounded-lg bg-zinc-900/95 px-4 py-3 text-center text-sm pointer-events-none" role="status">
        <LoaderCircle className="inline mr-2 h-4 w-4 animate-spin text-[#8fba96]" />
        {slow ? "Taking a while? Try Next server below." : `Opening ${serverName}…`}
      </div>}
  </>;
}
