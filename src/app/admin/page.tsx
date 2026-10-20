"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequests, deleteRequest, type MovieRequest } from "../actions";

export default function AdminPage() {
  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [status, setStatus] = useState("");
  useEffect(() => { void getRequests().then(setRequests); }, []);
  return <div className="max-w-5xl mx-auto w-full p-8">
    <h1 className="text-3xl font-black mb-4">Catalog & requests</h1>
    <p className="mb-6 text-foreground/70">The catalog now loads automatically from TMDB. Movies no longer need to be added or edited here.</p>
    <Link href="/movies" className="text-primary underline">Browse the live catalog</Link>
    <h2 className="text-2xl font-bold mt-10 mb-4">Movie requests</h2>
    {status && <p role="status">{status}</p>}
    {requests.length === 0 && <p className="text-foreground/60">No pending requests.</p>}
    <div className="space-y-4">{requests.map(request => <article key={request.id} className="p-5 rounded-xl bg-card border border-primary/20">
      <h3 className="font-bold">{request.title}</h3>
      <p>{request.details}</p><p className="text-sm text-foreground/60">{request.date}</p>
      <button className="mt-3 text-primary underline" onClick={async () => {
        if (!window.confirm("Delete this request?")) return;
        const result = await deleteRequest(request.id);
        if (result.success) setRequests(items => items.filter(item => item.id !== request.id));
        else setStatus("Could not delete the request.");
      }}>Delete request</button>
    </article>)}</div>
  </div>;
}
