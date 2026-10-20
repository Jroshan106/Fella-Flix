import { redirect } from "next/navigation";
import { currentViewer } from "@/lib/auth-server";
import { safeReturnPath } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeReturnPath((await searchParams).next);
  if (await currentViewer()) redirect(next);
  return <div className="w-full flex flex-1 items-center justify-center px-5 py-12">
    <section className="w-full max-w-md rounded-3xl border border-primary/25 bg-card p-8 shadow-2xl">
      <p className="text-primary text-2xl font-black tracking-tight mb-10">FellaFLIX</p>
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Your private screening room</p>
      <h1 className="text-3xl font-black mb-3">Welcome back.</h1>
      <p className="text-foreground/65 mb-8">Sign in to explore movies and series.</p>
      <LoginForm next={next} />
      <p className="mt-7 text-sm text-foreground/50">Access is by invitation. Ask the site owner for an account.</p>
    </section>
  </div>;
}
