"use client";
import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return <form className="space-y-5" onSubmit={async event => {
    event.preventDefault();
    setPending(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      window.location.assign(result.next);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
      setPending(false);
    }
  }}>
    <input type="hidden" name="next" value={next} />
    <div><label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
      <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={64}
        className="w-full rounded-xl border border-primary/25 bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" /></div>
    <div><label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256}
        className="w-full rounded-xl border border-primary/25 bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" /></div>
    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-background disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
