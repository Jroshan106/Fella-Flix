import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_EMAIL = "bgmblackscreen@gmail.com";
export function LegalContact({ subject }: { subject: string }) {
  return <a className="text-primary underline underline-offset-4 break-all" href={`mailto:${LEGAL_EMAIL}?subject=${encodeURIComponent(subject)}`}>{LEGAL_EMAIL}</a>;
}

export default function LegalPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <article data-legal-page className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
    <Link href="/" className="inline-flex items-center min-h-11 text-sm text-primary hover:underline">← Back to FellaFLIX</Link>
    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">FellaFLIX · Legal</p>
    <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">{title}</h1>
    <p className="mt-4 text-foreground/75 leading-relaxed">{description}</p>
    <p className="mt-3 text-xs text-foreground/55">Last updated: 21 October 2026</p>
    <nav aria-label="Legal pages" className="flex flex-wrap gap-x-5 gap-y-1 my-8 border-y border-primary/20 py-3 text-sm">
      <Link className="min-h-11 inline-flex items-center hover:underline" href="/terms">Terms of Service</Link>
      <Link className="min-h-11 inline-flex items-center hover:underline" href="/privacy">Privacy Policy</Link>
      <Link className="min-h-11 inline-flex items-center hover:underline" href="/dmca">DMCA</Link>
    </nav>
    <div className="space-y-8 text-sm sm:text-base leading-7 text-foreground/80 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2">{children}</div>
  </article>;
}
