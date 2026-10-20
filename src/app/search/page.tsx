"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CatalogBrowser from "../components/CatalogBrowser";
function SearchResults() {
  const query = useSearchParams().get("q") || "";
  return <CatalogBrowser key={query} initialQuery={query} />;
}
export default function SearchPage() {
  return <Suspense fallback={<p className="p-12 text-center">Loading search…</p>}><SearchResults /></Suspense>;
}
