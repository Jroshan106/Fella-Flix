import { NextRequest, NextResponse } from "next/server";
import { CatalogError, getCatalog, getMovie, getGenres, getCatalogProvider } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    if (params.get("view") === "genres") return NextResponse.json({ genres: await getGenres(), provider: getCatalogProvider() });
    const id = params.get("id");
    if (id !== null) return NextResponse.json({ movie: await getMovie(id) });
    if (params.get("view") === "home") {
      const [movies, anime] = await Promise.all([
        getCatalog(new URLSearchParams()),
        getCatalog(new URLSearchParams({ kind: "anime" })),
      ]);
      return NextResponse.json({ movies: movies.results.slice(0, 10), anime: anime.results.slice(0, 10) });
    }
    return NextResponse.json(await getCatalog(params));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof CatalogError ? error.message : "The movie catalog is temporarily unavailable." },
      { status: error instanceof CatalogError ? error.status : 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
