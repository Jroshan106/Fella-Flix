"use client";

import { useEffect, useState } from "react";

export function useCatalog<T>(url: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  const key = `${url}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    // Debounce typing and cancel previous requests when filters change.
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load titles.");
        if (!controller.signal.aborted) setState({ key, data });
      } catch (error) {
        if (!controller.signal.aborted) setState({ key, error: error instanceof Error ? error.message : "Unable to load titles." });
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [url, key]);
  return {
    data: state.key === key ? state.data : undefined,
    error: state.key === key ? state.error : undefined,
    loading: state.key !== key,
    retry: () => setAttempt(value => value + 1),
  };
}
