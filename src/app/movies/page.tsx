import CatalogBrowser from "../components/CatalogBrowser";
import { parseGenreIds } from "@/lib/catalog-presentation";

export default async function Page({ searchParams }: { searchParams: Promise<{ genres?: string }> }) {
  const ids = parseGenreIds((await searchParams).genres);
  return <CatalogBrowser key={ids.join(",")} kind="movie" initialGenreIds={ids} />;
}
