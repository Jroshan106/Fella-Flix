"use client";

import { useSyncExternalStore } from "react";
import { isUpcoming, todayInColombo } from "@/lib/catalog-presentation";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(() => listeners.forEach(notify => notify()), 60000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) { clearInterval(timer); timer = undefined; }
  };
}

export function UpcomingBadge({ releaseDate, kind = "movie", className = "" }: {
  releaseDate: string; kind?: "movie" | "series"; className?: string;
}) {
  const today = useSyncExternalStore(subscribe, todayInColombo, todayInColombo);
  if (!isUpcoming(releaseDate, today)) return null;
  return <span title={`${kind === "series" ? "Premieres" : "Releases"} ${releaseDate}`}
    className={`inline-flex items-center gap-1.5 rounded-md border border-amber-300/40 bg-amber-950/95 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-200 shadow-sm ${className}`}>
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-300" />Upcoming
  </span>;
}
