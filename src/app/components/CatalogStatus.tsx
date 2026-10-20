export function CatalogStatus({ error, retry }: { error?: string; retry: () => void }) {
  return <div role={error ? "alert" : "status"} className="p-12 text-center text-foreground/70">
    <p>{error || "Loading titles…"}</p>
    {error && <button onClick={retry} className="mt-4 rounded-lg bg-primary px-5 py-2 text-background">Retry</button>}
  </div>;
}
