"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";

export default function FellaPlayer({ id, title }: { id: string; title: string }) {
  const [attempt, setAttempt] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/superembed?id=${encodeURIComponent(id)}&format=json`, {
          signal: controller.signal, cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok || typeof result.url !== "string") {
          throw new Error(result.error || "Unable to load the stream.");
        }
        if (!controller.signal.aborted) setUrl(result.url);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Unable to load the stream.");
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [id, attempt]);

  return (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-zinc-950 border-b border-white/10">
        <span className="text-sm font-black tracking-wider text-[#8fba96]">FellaFLIX Player</span>
        <span className="text-xs text-white/50">Powered by SuperEmbed</span>
      </div>
      {url ? (
        <iframe key={url} src={url} className="w-full flex-1 border-0" allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture" title={`${title} — FellaFLIX Player`} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center" role="status" aria-live="polite">
          {error ? <>
            <p className="text-sm text-white/80">{error}</p>
            <button className="flex items-center gap-2 rounded-lg bg-[#8fba96] px-4 py-2 text-black font-semibold"
              onClick={() => { setError(null); setUrl(null); setAttempt(value => value + 1); }}>
              <RefreshCw className="h-4 w-4" /> Retry stream
            </button>
            <p className="text-xs text-white/50">You can also select another server above.</p>
          </> : <><LoaderCircle className="h-7 w-7 animate-spin text-[#8fba96]" /><p>Finding your stream…</p></>}
        </div>
      )}
    </div>
  );
}
